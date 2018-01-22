/**
 * Grunt Socko Task
 */
import { taskFunction } from '../lib/sockoTaskFunction'

/**
 * Register the socko task with grunt. This is merely a bridge to [[sockoTaskFunction]]
 * @param grunt the grunt object
 */
export = function (grunt: IGrunt): void {
  grunt.registerMultiTask('socko', 'Grunt-Plugin for SOCKO!', taskFunction)
}
