module.exports = function(grunt) {

  grunt.initConfig({
    meta: {
      banner: '/*! github.com/gillescochez/jQuery.doTemplate */'
    },
    concat: {
      dist: {
        src: [
            '<banner>',
            'src/head.js',
            'src/core.js',
            'src/engine.js',
            'src/plugin.js',
            'src/foot.js'
        ],
        dest: 'dist/jquery.doTemplate.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/jquery.doTemplate.js'],
        dest: 'dist/jquery.doTemplate.min.js'
      }
    }
  });

  grunt.registerTask('default', 'concat min');
};
