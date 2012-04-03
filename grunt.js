module.exports = function(grunt) {

  grunt.initConfig({
    meta: {
      banner: '/*! github.com/gillescochez/$.doTemplate */'
    },
    concat: {
      dist: {
        src: [
            '<banner>',
            'src/head.js',
            'src/core.js',
            'src/template.js',
            'src/plugin.js',
            'src/foot.js'
        ],
        dest: 'dist/$.doTemplate.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/$.doTemplate.js'],
        dest: 'dist/$.doTemplate.min.js'
      }
    }
  });

  grunt.registerTask('default', 'concat min');
};
