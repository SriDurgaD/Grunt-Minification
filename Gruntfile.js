var otherFiles =  require('./config')
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Used for optimizing images

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    src: otherFiles.imageFiles,
                    dest: 'dist'
                }]
            }
        },

        //Used to read the script files and css files from index.html

        dom_munger: {
            your_target: {
                options: {
                    read: [
                        { selector: 'link', attribute: 'href', writeto: 'cssRefs' },
                        { selector: 'script', attribute: 'src', writeto: 'jsRefs' }
                    ],
                    remove: ['script', 'link'],
                    append: [
                        { selector: 'head', html: '<link href="css/app.full.min.css" rel="stylesheet">' },
                        { selector: 'body', html: '<script src="js/app.full.min.js"></script>' }
                    ]
                },
                src: 'index.html',
                dest: 'distInter/index.html'
            },
        },

        // Concats all the js files

        concat: {
            js: {
                src: '<%= dom_munger.data.jsRefs %>',
                dest: 'distInter/built.js',
            },
        },

        //annoates all the files 

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: { 'distInter/annoted.js': ['distInter/built.js'] }
            }
        },

        // Uglifying the javscript/angular codes


        uglify: {
            dist: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: false,
                        hoist_funs: false
                    },
                    mangle: {
                        except: ['angular']
                    }

                },
                files: {

                    'dist/js/app.full.min.js': ['distInter/annoted.js']
                }
            }
        },

        // Minifying the css files

        cssmin: {
            main: {
                src: '<%= dom_munger.data.cssRefs %>',
                dest: 'dist/css/app.full.min.css'
            }
        },
        // Minifying the html files

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: true
                },
                files: {
                    'dist/index.html': 'distInter/index.html',
                }
            },
            dev: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: true
                },
                files: [{
                    expand: true,
                    src:otherFiles.htmlFiles,
                    dest: 'dist'
                }]
            }
        },

        //Can be used to copy the files like fonts

        copy: {
            main: {
                files: [

                    { expand: true, src: ['assets/css/fonts/**'], dest: 'dist/assets/css/fonts', flatten: true, filter: 'isFile' },
      
                ]
            }
        },

        //To clean the intermediate folder 

        clean: {
            folder: ['distInter']
        },


        fixmyjs: {
            options: {
                config: '.jshintrc',
                indentpref: 'tabs'
            },
            test: {
                files: [
                    { expand: true, src: otherFiles.fixJsFiles, dest: otherFiles.destinationOfFixJs}
                ]
            }
        },



    })

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-dom-munger');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-fixmyjs');

    grunt.registerTask('dom', ['dom_munger']);
    grunt.registerTask('sonar', ['fixmyjs']);

    grunt.registerTask('default', ['dom_munger', 'imagemin', 'concat', 'ngAnnotate', 'cssmin', 'uglify', 'htmlmin', 'clean']);
}
