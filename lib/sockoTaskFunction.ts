import * as grunt from 'grunt'
import { SockoOptionsInterface } from './SockoOptionsInterface'
import { SockoRunner } from './SockoRunner'

/**
 * The main Grunt task function for the socko task
 */
export function taskFunction (this: grunt.task.ITask): void {

  let done = this.async()

  let options = this.options<SockoOptionsInterface>({
    input: null,
    output: null,
    node: null,
    ignores: [],
    renames: [],
    skipIdenticalSockets: false,
    clean: false,
    hierarchy: null,
    ignoreMissing: false
  })

  if (!options.input) {
    grunt.log.error('Please specify an fileInput directory')
    done(false)
  }

  if (!options.output) {
    grunt.log.error('Please specify an output directory')
    done(false)
  }

  if (!options.node) {
    grunt.log.error('Please specify a node')
    done(false)
  }

  let runner = new SockoRunner(options)

  runner.run()
    .catch(
      (error) => {
        grunt.log.error(error.message)
        done(false)
      }
    )
    .then(
      () => {
        done()
      }
    )

}
