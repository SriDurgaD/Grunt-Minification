//Path to html files other than index.html
var htmlFiles =['app/components/**/*.html', 'templates/*.html'];

//Path to image files
var imageFiles = ['assets/img/*.{png,jpg,gif}'];

//Path to the js files that need fix like adding semicolons,
//changing the case of functions 
var fixJsFiles =  ['DrugProfile/assets/js/*.js'];

//Destination to the js files thst have been fixed
var destinationOfFixJs = 'sonar';

//Creating a object from above. No need to modify
var otherFiles = {
    'htmlFiles': htmlFiles,
    'imageFiles': imageFiles,
    'fixJsFiles': fixJsFiles,
    'destinationOfFixJs': destinationOfFixJs
}

module.exports = otherFiles;