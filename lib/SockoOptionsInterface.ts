/**
 * Options for the socko task
 */
export interface SockoOptionsInterface {
  /**
   * The path to the input directory
   */
  input: string
  /**
   * The path to the output directory
   */
  output: string
  /**
   * The node to use
   */
  node: string
  /**
   * A list of ignores (see the socko cli documentation for details) [optional]
   */
  ignores: Array<string>
  /**
   * A list of renames (see the socko cli documentation for details) [optional]
   */
  renames: Array<string>
  /**
   * Do not recreate socket files, that didn't change [optional, defaults to false]
   */
  skipIdenticalSockets: boolean
  /**
   * Clean the output directory [optional, defaults to false]
   */
  clean: boolean
  /**
   * Path to the hirarchy directory [optional. Defaults to <input>/_socko]
   */
  hierarchy: string
  /**
   * Ignore missing cartridges for slots. Will break, if set to false. [optional, defaults to false]
   */
  ignoreMissing: boolean
}
