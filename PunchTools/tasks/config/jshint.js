module.exports = function(grunt) {
  grunt.config.set('jshint', 
    {
      api: {
        files: {
          src: [
            'api/controllers/*.js',
            'api/services/**/*.js',
            'api/policies/*.js',
            'api/models/*.js',
            'updates/*.js'
          ]
        },
        options: {
          jshintrc: '.jshintrc_api'
        }
      },
      options: {
        jshintrc: '.jshintrc'
      }
    });
  grunt.loadNpmTasks('grunt-contrib-jshint');
};