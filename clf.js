const fs=require('fs');
const glob=require('glob');
const prlr = require('primitive_logger')

function getFilesSync (options, callback) {
	if (typeof options === 'function') {
		callback = options
		options = null
	}
	var file_list=processEachFile (options);
	if(callback) {
		callback(file_list);
	}
	return file_list;
}

function processEachFile (options, callback) {
	if (typeof options === 'function') {
		callback = options
		options = null
	}
	var opts = setopts(options);
	var files_to_process = [];
	var arguments = process.argv.slice(opts.slice);
	if(opts.filesList) {
		arguments = opts.filesList;
	}
	for (let j = 0; j < arguments.length; j++) {
		var path = arguments[j];
		files = glob.sync(path, {nonull: true});
		if (files) {
			//console.log("globbed list: "+JSON.stringify(files));
			for (var i=0; i<files.length; i++) {
				var file=files[i];
				//console.log(file);
				if( files_to_process.indexOf(file) < 0 ) {
					if (opts.validate) {
						is_valid=false;
						try {
							var stats = fs.statSync(file);
							if (stats.isFile()) {
								if (opts.files)  {
									is_valid=true;
								} else {
									con_out(opts, file+": is a file. Skipping, because option 'files'="+files.dirs);
								}
							} else if (stats.isDirectory()) {
								if (opts.dirs)  {
									is_valid=true;
								} else {
									con_out(opts, file+": is a directory. Skipping, because option 'dirs'="+opts.dirs);
								}
							} else {
								con_out(opts, file+": is not a file or directory. Skipping");
							}
						} catch (statEx) {
							con_out(opts, file+": not found on the local file system");
						}
					} else {
						is_valid=true;
					}
					if (is_valid) {
						if(callback) {
							con_out(opts, "Invoking callback for file "+file);
							callback(file);
						} else {
							con_out(opts,"No callback was given to process file "+file);
						}
						files_to_process.push(file);
					}
					
				} else {
					con_out(opts, file+": is a duplicate - already processed");
				}
			}
		}
	}
	return(files_to_process);
}

// export the module
module.exports = {
    getFilesSync: getFilesSync,
    processEachFile: processEachFile
};

function con_out(opts, data) {
	opts.logger.instance.log("command_line_files", data);
}

function setopts (options) {
	var opts = {
		slice: 2,
		verbose: false,
		validate: true,
		files: true,
		dirs: false
	};
	if (!options)
		options = {};

	if ( !isNaN(options.slice) ) { 
		opts.slice = options.slice;
	} 
	if (typeof options.verbose === "boolean" ) {
		opts.verbose = options.verbose;
	} 
	if (typeof options.validate === "boolean") {
		opts.validate = options.validate;
	} 
	if (typeof options.files === "boolean") {
		opts.files = options.files;
	} 
	if (typeof options.dirs === "boolean") {
		opts.dirs = options.dirs;
	} 
	if (options.filesList && options.filesList.length > 0) {
		opts.filesList = options.filesList;
	}
	
	if(!options.logger) {
		opts.logger = {};
	} else {
		opts.logger = options.logger;
	}
	if (!opts.logger.instance) {
		opts.logger.instance = new prlr.Logger(opts);
	}
	return opts;
}