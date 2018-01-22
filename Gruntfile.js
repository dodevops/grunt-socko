module.exports = function (grunt) {

  grunt.initConfig({
    tslint: {
      options: {
        configuration: 'tslint.json'
      },
      files: {
        src: [
          'lib/**/*.ts',
          'tasks/**/*.ts',
          'test/**/*.ts',
          '!lib/**/*.d.ts',
          '!tasks/**/*.d.ts',
          '!test/**/*.d.ts'
        ]
      }
    },
    clean: {
      coverage: ['test/coverage'],
      doc: ['docs']
    },
    ts: {
      default: {
        tsconfig: true
      }
    },
    shell: {
      baseman: {
        command: "nyc baseman run"
      }
    },
    coveralls: {
      default: {
        src: 'test/coverage/lcov.info'
      }
    },
    typedoc: {
      default: {
        options: {
          out: 'docs/',
          name: 'grunt-socko',
          readme: 'README.md',
          "external-modulemap": '.*/([^/]*)/.*'
        },
        src: ['tasks/socko.ts']
      }
    }
  })

  grunt.loadNpmTasks('grunt-ts')
  grunt.loadNpmTasks('grunt-tslint')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-coveralls')
  grunt.loadNpmTasks('grunt-typedoc')

  grunt.registerTask(
    'build',
    [
      'tslint',
      'ts'
    ]
  )

  grunt.registerTask(
    'doc',
    [
      'clean:doc',
      'typedoc'
    ]
  )

  grunt.registerTask(
    'default',
    [
      'build'
    ]
  )

  grunt.registerTask(
    'test',
    [
      'build',
      'clean:coverage',
      'shell:baseman'
    ]
  )

  grunt.registerTask(
    'release',
    [
      'test',
      'doc'
    ]
  )

}