# grunt-socko - Grunt-Plugin for SOCKO! [![Build Status](https://travis-ci.org/dodevops/grunt-socko.svg?branch=master)](https://travis-ci.org/dodevops/grunt-socko) [![Coverage Status](https://coveralls.io/repos/github/dodevops/grunt-socko/badge.svg?branch=master)](https://coveralls.io/github/dodevops/grunt-socko?branch=master) [![npm](https://img.shields.io/npm/v/grunt-socko.svg)](https://www.npmjs.com/package/grunt-socko)

## Introduction

This is the Grunt frontend for the [Socko-framework](https://github.com/dodevops/socko-api). It works mostly identical to the [Socko-CLI application](https://github.com/dodevops/socko) working on directories and files. You might read the introduction there first to get an overview of SOCKO's features.

## Usage

Install the plugin using

```
npm install grunt-socko --save-dev
```

In your Gruntfile.js, load the tasks of the plugin by adding the line

```js
grunt.loadNpmTasks('grunt-socko')
```

Now you're equipped with a "socko" task, that you can [configure and run using the usual Grunt features](https://gruntjs.com/sample-gruntfile).

## Configuration

The plugin does not work with the usual Grunt files-options as it specifically requires one input, one output and one node. You can configure those in the options object of your task configuration:

```js
socko: {
  nodeA: {
    options: {
      input: "basic",
      output: "output.basic",
      node: "nodeA"
    }
  },
  nodeB: {
    options: {
      input: "basic",
      output: "output.basic",
      node: "nodeA:nodeB"
    }
  }
}
```

The following options are required:

* input: The path to the input directory
* output: The path to the output directory
* node: The node to process

For other options, please see the API documentation of the [SockoOptionsInterface](https://dodevops.github.io/grunt-socko/interfaces/lib.sockooptionsinterface.html)

## Migrating from Socko 1.0.0

Please see the [notes from the CLI](https://github.com/dodevops/socko/blob/2.0.0/README.md#migrating-from-socko-1) about the breaking changes between SOCKO! 1 and 2