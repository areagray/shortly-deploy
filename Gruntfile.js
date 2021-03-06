module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src:['./public/client/app.js',
            './public/client/link.js',
            './public/client/links.js',
            './public/client/linkView.js',
            './public/client/linksView.js',
            './public/client/createLinkView.js',
            './public/client/router.js'],
        dest: './public/dist/app.js'
      },
      lib: {
        src:['./public/lib/jquery.js', './public/lib/underscore.js', './public/lib/backbone.js', './public/lib/handlebars.js'],
        dest: './public/dist/lib.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/ServerSpec.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      app: {
        src: 'public/dist/app.js',
        dest: 'public/dist/app.min.js'
      },
      lib: {
        src: 'public/dist/lib.js',
        dest: 'public/dist/lib.min.js'    
      }
    },

    jshint: {
      files: {
        src: ['./public/client/**/*.js']
      },
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      css: {
        src: 'public/style.css',
        dest: 'public/dist/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
//set up the comman line git push here
    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'jshint', 'build', 'upload'
  ]);

  grunt.registerTask('default', ['jshint','concat', 'uglify', 'cssmin']);

};
