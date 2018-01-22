import { SockoOptionsInterface } from './SockoOptionsInterface'
import * as fs from 'fs'
import * as path from 'path'
import * as grunt from 'grunt'
import { FileNode, ScanOptions } from 'file-hierarchy'
import { ProcessorOptionsFactory, SkippedNodeBuilder, SockoNodeInterface, SockoProcessor } from 'socko-api'
import { ConverterOptionsFactory, FileToTreeConverter, TreeToFileConverter } from 'socko-converter-file'
import Bluebird = require('bluebird')
import del = require('del')

/**
 * The runner doing the actual work
 */
export class SockoRunner {
  private _options: SockoOptionsInterface

  private _paths: { input: string, output: string, hierarchy: string }

  private _trees: {
    fileInput: FileNode,
    fileHierarchy: FileNode,
    sockoInput: SockoNodeInterface,
    sockoHierarchy: SockoNodeInterface,
    sockoNode: SockoNodeInterface
  }

  constructor (options: SockoOptionsInterface) {
    this._options = options
    this._paths = {
      input: null,
      output: null,
      hierarchy: null
    }
    this._trees = {
      fileHierarchy: null,
      fileInput: null,
      sockoNode: null,
      sockoInput: null,
      sockoHierarchy: null
    }
  }

  /**
   * Runs the socko generation process
   * @return {Bluebird<void>}
   */
  public run (): Bluebird<void> {

    return this.checkAccess()
      .then(
        () => {
          return this.convertToFileTrees()
        }
      )
      .then(
        () => {
          return this.convertToSockoTrees()
        }
      )
      .then(
        () => {
          return this.runSocko()
        }
      )
      .then(
        outputNode => {
          if (this._options.clean) {
            return del(this._paths.output)
              .then(
                () => {
                  return this.convertFromOutputNode(outputNode)
                }
              )
          } else {
            return this.convertFromOutputNode(outputNode)
          }
        }
      )
  }

  /**
   * Checks access to all needed directories
   * @return {Bluebird<void>}
   */
  private checkAccess (): Bluebird<void> {

    grunt.log.subhead('Checking valid access to specified paths')

    let input = this._options.input
    let output = this._options.output
    let hierarchy: string

    if (!this._options.hierarchy) {
      hierarchy = path.join(this._options.input, '_socko')
    } else {
      hierarchy = this._options.hierarchy
    }

    let nodePath = path.join(hierarchy, ...this._options.node.split(':'))

    let canAccess = Bluebird.promisify<void, fs.PathLike, number | undefined>(fs.access)

    return Bluebird.all(
      [
        canAccess(input, fs.constants.R_OK),
        canAccess(output, fs.constants.W_OK),
        canAccess(hierarchy, fs.constants.R_OK),
        canAccess(nodePath, fs.constants.R_OK)
      ]
    )
      .catch(
        (error: any) => {
          return error.code === 'ENOENT'
        },
        (error: any) => {
          if (error.path === output) {
            return Bluebird.fromCallback(fs.mkdir.bind(null, output))
          }
          return Bluebird.reject(
            new Error(`Can not find directory ${error.path}. Please check your command line arguments.`)
          )
        }
      )
      .catch(
        (error: any) => {
          return error.code === 'EACCES'
        },
        (error: any) => {
          return Bluebird.reject(
            new Error(`Can not access directory ${error.path}. Please check your command line arguments.`)
          )
        }
      )
      .then(
        () => {
          this._paths.hierarchy = hierarchy
          this._paths.input = input
          this._paths.output = output
          return Bluebird.resolve()
        }
      )
  }

  /**
   * Converts the directories to `FileTree`
   * @return {Bluebird<void>}
   */
  private convertToFileTrees (): Bluebird<void> {
    grunt.log.subhead('Converting fileInput and fileHierarchy directories to tree.')
    grunt.log.verbose.writeln('Ignoring fileHierarchy path in fileInput path and vice versa while doing so.')

    let inputScanOptions = new ScanOptions(this._paths.input)
    if (this._paths.hierarchy.startsWith(this._paths.input)) {
      inputScanOptions.filter = (filterPath, entry) => {
        return Bluebird.resolve(!path.join(filterPath, entry).endsWith(this._paths.hierarchy))
      }
    }

    let hierarchyScanOptions = new ScanOptions(this._paths.hierarchy)

    if (this._paths.input.startsWith(this._paths.hierarchy)) {
      hierarchyScanOptions.filter = (filterPath, entry) => {
        return Bluebird.resolve(!path.join(filterPath, entry).endsWith(this._paths.input))
      }
    }

    return Bluebird.props({
      input: new FileNode().scan(inputScanOptions),
      hierarchy: new FileNode().scan(hierarchyScanOptions)
    })
      .then(
        trees => {
          this._trees.fileHierarchy = trees.hierarchy
          this._trees.fileInput = trees.input
          return Bluebird.resolve()
        }
      )
  }

  /**
   * Converts the `FileTree`s to `SockoTree`s
   * @return {Bluebird<void>}
   */
  private convertToSockoTrees (): Bluebird<void> {
    grunt.log.subhead('Converting file trees to socko trees')

    let inputConverterOptions = new ConverterOptionsFactory().create()
    let inputConverter = new FileToTreeConverter(inputConverterOptions)

    let hierarchyConverterOptions = new ConverterOptionsFactory().create()
    let hierarchyConverter = new FileToTreeConverter(hierarchyConverterOptions)

    return Bluebird.props({
      input: inputConverter.convert(this._trees.fileInput),
      hierarchy: hierarchyConverter.convert(this._trees.fileHierarchy)
    })
      .then(
        trees => {
          this._trees.sockoHierarchy = trees.hierarchy
          this._trees.sockoInput = trees.input
          return this._trees.sockoHierarchy.getNodeByPath(`:_root:${this._options.node}`, ':')
        }
      )
      .then(
        node => {
          this._trees.sockoNode = node as SockoNodeInterface
          return Bluebird.resolve()
        }
      )
  }

  /**
   * Calls socko to generate the output node
   * @return {Bluebird<SockoNodeInterface>} the output node
   */
  private runSocko (): Bluebird<SockoNodeInterface> {
    grunt.log.subhead('Running socko')

    let processorOptions = new ProcessorOptionsFactory().create()
    if (this._options.ignores && this._options.ignores.length > 0) {
      let ignoreObject = new Map<string, string>()

      for (let ignoreOption of this._options.ignores) {
        let ignoreSplit = ignoreOption.split(/=/)

        if (ignoreSplit.length === 1) {
          ignoreSplit.unshift('*')
        }

        ignoreObject.set(ignoreSplit[1], ignoreSplit[0])
      }

      processorOptions.processCartridgeNode = node => {
        if (ignoreObject.has(node.name)) {
          if (ignoreObject.get(node.name) === '*') {
            return Bluebird.resolve(new SkippedNodeBuilder().build())
          } else {
            return node.getPath(':')
              .then(
                value => {
                  if (`${ignoreObject.get(node.name)}:${node.name}` === value) {
                    return Bluebird.resolve(new SkippedNodeBuilder().build())
                  } else {
                    return Bluebird.resolve(node)
                  }
                }
              )
          }
        } else {
          return Bluebird.resolve(node)
        }
      }
    }
    if (this._options.renames && this._options.renames.length > 0) {
      let renameObject = new Map<string, string>()

      for (let renameOption of this._options.renames) {
        let splitRenameOption = renameOption.split(/:/)
        renameObject.set(splitRenameOption[0], splitRenameOption[1])
      }
      processorOptions.processResultTreeNode = node => {
        if (renameObject.has(node.name)) {
          node.name = renameObject.get(node.name)
        }
        return Bluebird.resolve(node)
      }
    }
    processorOptions.allowEmptyCartridgeSlots = this._options.ignoreMissing

    return new SockoProcessor().process(
      this._trees.sockoInput,
      this._trees.sockoNode,
      processorOptions
    )
  }

  /**
   * Converts the output node to a directory with files
   * @param {SockoNodeInterface} outputNode the output node to generate
   * @return {Bluebird<void>}
   */
  private convertFromOutputNode (outputNode: SockoNodeInterface): Bluebird<void> {
    grunt.log.subhead('Converting output tree to directory')

    let converterOptions = new ConverterOptionsFactory().create()
    converterOptions.checkBeforeOverwrite = this._options.skipIdenticalSockets
    converterOptions.outputPath = this._paths.output

    return new TreeToFileConverter(converterOptions).convert(outputNode)
  }
}
