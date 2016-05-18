# grunt-socko

> Grunt-Plugin for SOCKO!

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-socko --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-socko');
```

If you don't know, what SOCKO! is, please read [this](https://github.com/dploeger/socko/blob/master/README.md) first:


## The "socko" task

### Overview
In your project's Gruntfile, add a section named `socko` to the data object passed into `grunt.initConfig()`.

Currently, grunt-socko only uses the task or target-specific options to set up
SOCKO! accordingly.

```js
grunt.initConfig({
  socko: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.input
Type: `String`
Default value: ``

Points to the SOCKO! input directory. 

#### options.output
Type: `String`
Default value: ``

Points to the SOCKO! output directory

#### options.node
Type: `String`
Default value: ``

Sets the node to generate.

### Usage Example

```js
grunt.initConfig({
  socko: {
    options: {
        input: 'documentation',
        output: 'output/documentation',
        node: 'prod'
    },
    default: {},
    dev: {
        options: {
            node: 'dev'
        }
    },
  },
});
```

This would call SOCKO! to generate the input path "documentation" into the 
output path "output/documentation". The target "default" would use node "prod",
the target "dev" would use node "dev".

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
