const lr = require('primitive_logger')
var clf = require('./clf.js');

// Example 1 : Enable "command_line_files" option in logger 
//             to make it print some diagnostics
clf.getFilesSync( {logger:{types:["command_line_files"]}}, (files) => {
	console.log("getFilesSync array 2: "+JSON.stringify(files));
	files.forEach( (file) => {
		console.log("getFilesSync for each: "+file);
	});
});

// Example 2 : Create logger and pass it over to command_line_files module 
//             with "command_line_files" option enabled.
var options = {
	logger: {
		format: { 
			date: {show: true},
			type: {show: true}
		},
		outputs: [{	file: "stdout",	types: ["command_line_files","info"]}]
	},
	filesList: ["*"]
}
logger = new lr.Logger(options);
options.logger.instance = logger;

clf.processEachFile( options, (filename) => {
    logger.log("info", "Processing file: "+filename);
});


