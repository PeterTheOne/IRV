module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        qunit: {
            files: ['test/index.html']
        },
        coveralls: {
            options: {
                // dont fail if coveralls fails
                force: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-qunit-istanbul');

    // Task to run tests
    grunt.registerTask('test', 'qunit');
};
