'use strict';

var grunt = require('grunt');

var filesToCheck=[
    'dynamic.json',
    'dynamic.txt',
    'dynamic.xml',
    'static.txt.test',
    'collector_completely.txt',
    'subdirectory/static.txt'
];

exports.socko = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default: function(test) {
    test.expect(filesToCheck.length);

    for (var i = 0; i < filesToCheck.length; i++) {
      var actual = grunt.file.read('tmp/' + filesToCheck[i]);
      var expected = grunt.file.read('test/expected/' + filesToCheck[i]);
      test.equal(actual, expected, 'Generated file is not like the expected' +
          ' file.');
    }

    test.done();
  },
};
