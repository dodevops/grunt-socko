/*
 * grunt-socko
 * https://github.com/dploeger/grunt-socko
 *
 * Copyright (c) 2016 Dennis Ploeger
 * Licensed under the MIT license.
 */

'use strict';

var socko = require('socko');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('socko', 'Grunt-Plugin for SOCKO!', function () {

        var options = this.options();

        if (!options.hasOwnProperty('input')) {
            grunt.log.error('Input option missing.');
            return false;
        }

        if (!options.hasOwnProperty('output')) {
            grunt.log.error('Output option missing.');
            return false;
        }

        if (!options.hasOwnProperty('node')) {
            grunt.log.error('Node option missing.');
            return false;
        }

        var done = this.async();
        var generatorApi = new socko.GeneratorApi(options.input);

        generatorApi.generate(
            options.node,
            options.output,
            function (error) {
                if (error) {
                    grunt.log.error('Error generating using SOCKO!', error);
                    done(error);
                } else {
                    grunt.log.writeln('socko: SOCKO! generation completed.');
                    done();
                }
            });

    });

};
