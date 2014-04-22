module.exports = function(grunt) {
  
  var pck = grunt.file.readJSON('package.json');
  var name = pck.exports || pck.name;
  var build = pck.name + '.js';
  var buildMin = pck.name + '.min.js';
  
  var brwsFiles = {};
  brwsFiles[build] = ['index.js'];

  var uglFiles = {};
  uglFiles[buildMin] = [build];
  

  var config = {
    
    pkg: pck,
    
    browserify: {
      dist: {
        files: brwsFiles
      },
      options: {standalone: name}
    },

    uglify: {
      my_target: {
        files: uglFiles
      }
    }

  };

  // load
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // config
  grunt.initConfig(config);

  // tasks
  grunt.registerTask('default', ['browserify', 'uglify']);

};