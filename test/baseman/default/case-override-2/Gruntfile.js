var path = require('path')
module.exports = function (grunt) {
  grunt.initConfig({
    socko: {
      default: {
        options: {
          input: 'assets/input',
          output: 'assets/output',
          hierarchy: 'assets/hierarchy',
          node: 'nodeA',
          clean: true,
          renames: [
            'testSimpleNode.txt:testSimpleNodeRenamed.txt'
          ]
        }
      }
    }
  })
  grunt.loadTasks(path.join(__dirname, '..', '..', '..', '..', 'tasks'))
  grunt.registerTask(
    'default',
    [
      'socko'
    ]
  )
}