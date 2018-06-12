# Grunt-Minification
Minification and Uglification of Javascript/ AngularJs application using Grunt
Contents:
1. What is Grunt?
2. Prerequisites
3. Understanding Files and setup of the project
4. Integration with Jenkins
What is Grunt?
It is JavaScript task runner useful for performing repetitive tasks like minification, compilation, unit testing, linting, etc.
Prerequisites: Node version>=0.8.0
Understanding Files in the project:
1. package.json: It contains the names of the packages that needs to be installed. One can create a new package.json file by running the command “npm init”. The details like project name, description, author name, version etc need to be provided. The artifact package.json has the required dependencies that are needed for the project. To install the packages run the command “npm install –save-dev”.
2. config.js: It contains the path details of html files and images. One must provide the location details to their html files and images. If you need to add semicolons in your js give the location to these files also otherwise they can be left unmodified.
3. Gruntfile.js: Let us take an example and see how we can minify css files using grunt and details that are provided in the gruntfile. To minify css files we need grunt-contrib-cssmin. “npm install –save-dev” installs this package also. If this command is used then one can skip the next command otherwise to install this use the command “npm install grunt-contrib-cssmin –save-dev”. The –save-dev is used to indicate it as a dev dependency. Running the command updates your package.json file.
A Gruntfile is comprised of the following parts:
• The "wrapper" function
• Project and task configuration
• Loading Grunt plugins and tasks
• Custom tasks
The "wrapper" function:
• Every Gruntfile (and gruntplugin) uses this basic format, and all of your Grunt code must be specified inside this function:
module.exports = function(grunt) {
// Do grunt-related things in here
};
Project and task configuration:
Most Grunt tasks rely on configuration data defined in an object passed to the grunt.initConfig method. grunt.file.readJSON('package.json') imports the JSON metadata stored in package.json into the grunt config.
module.exports = function (grunt) {
grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),
cssmin: {
dist: {
files: {destination: [source]}
}}
})
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.registerTask('default', ['cssmin']);
}
cssmin is the task name. dist is subtask name under cssmin. The order followed while writing in files is destination and source. The plugin that is required by your task must be loaded. grunt.loadNpmTasks command in the above loads the task plugin. The task must also be registered. In the above code cssmin is given in the default task. Now you gruntfile is ready to minify css, run the command grunt to start the process. There can be move than one subtask. “grunt cssmin” runs all the subtaks. To run a particular subtask one can use “grunt cssmin subtask-name”
If you get command not found you must set the path. Run this command path=%PATH%;%AppData%\npm to set the path
Custom tasks:
If you have many tasks and you want to run only few tasks then use the following command
grunt.registerTask('dom_html',['dom_munger','htmlmin',])
In the above command dom_html is the name of task followed by the tasks needed to be done. You can give your own name and run the command grunt followed by name of task like grunt dom_html;
Artifact Gruntfile.js:
Running grunt creates a folder name “dist”, which contains the minified js,css and html files. It also optimizes images. The contents inside the “dist” folder can be used for deployment purpose.
Details of tasks in the artifact gruntfile:
The artifact default task reads the index.html to get location of javascript and css files using the plugin dom_munger and writes the location to variables jsRefs and cssRefs. After this, script and link tags are removed and are replaced with that referencing to that of minified file. The new file that is created is placed in distInter folder
Now css files are minified by cssmin plugin. The dom_munger.data.cssRefs variable gives the location to css files. The minified css file is placed in dist/css as given in the destination.
The JS files are concatenated, annotated and uglified. Uglify does not retain order so they are concatenated first. Annotate is used to make angular code min-safe. It changes the
form.factory('Users', function($http) {
to
form.factory('Users', ['$http', function($http) {
When UglifyJS runs, it will rename our parameters from $scope and $http to a and b respectively. The presence of DI annotations being passed in as strings in an array, blocks them from being renamed. Therefore, these renamed parameters can still access to the necessary dependencies
Htmlmin is used to minify the html files. There are two tasks, one minifies the index.html, and other minifies the remaining html files. The options given are to remove comments, collapse whitespace and to preserve line breaks. One can change them to true or false based on the need.
Imagemin is used to optimize images. The optimization level used is 5. One can change the optimization level according to the need. Expand puts the images in the same folder structure as it was used in the project. Using this prevents from changing the location of images in the files.
Any intermediate files like concatenated file etc are placed in distInter. As this folder is not useful, we can delete this folder. Clean plugin is used to delete the folder.
So the default grunt task runs the above all.
Sometimes we might have fonts or you have files to which you do not want to make changes. Then they can copied using the copy plugin. The syntax is provided in the artifact file. One must give the location of files and must include the task in the default task.
The artifact can also be used to improve your Javascript code. The task fixmyjs reads configuration from “.jshintrc” file. The configuration is set to fix semicolons. Running the command “grunt sonar” fixes all the semicolons and formats your code. The source and destination to these files must be provided in the config.js or one provide the path directly in the Gruntfile.
The Configuration in the .jshintrc file can be also changed to changes case of functions to camelcase, but one must be careful while using this. “asi” to true fixes semicolons. Case of functions can be changed to camelcase by setting “camelcase” to true. Other configuration details can be found on https://github.com/jshint/fixmyjs

Integration with Jenkins/looper:
The contents inside dist folder can be directly used for deployment. Minification and deployment process can be directly done by looper/Jenkins. For this one must provide the tools required in their config file.
tools:
nodejs:
- 6.9.1
npm:
- 3.10.9
In their flow to their deployment one can add the following steps
npm install
gulp
The above steps creates a folder dist which can be used for deployment. In the command to deploy one create a war file of the above folder
Example :
mvn deploy:deploy-file -Dfile=dist/dist.war \
