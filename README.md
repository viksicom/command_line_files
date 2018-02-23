# command_line_files

Takes the command line parameters and bulds an array of filenames (including path), after validating that files actually exist. The wild cards are processed using Glob module. 


## Usage

Install with npm

```
npm install --save command_line_files
```

```javascript
const clf = require('command_line_files');

// Example 1: getFilesSync returns an array of filenames and directories
files = clf.getFilesSync();
console.log("getFilesSync array: "+JSON.stringify(files));
```

```javascript
const clf = require('command_line_files');

// Example 2: getFilesSync passes an array to callback function
clf.getFilesSync( (files) => {
	console.log("getFilesSync array 2: "+JSON.stringify(files));
	files.forEach( (file) => {
		console.log("getFilesSync for each: "+file);
	});
});
```

```javascript
const clf = require('command_line_files');

// Example 3: processEachFile uses provided filesList, and invokes the callback function for each file
clf.processEachFile( (filename) => {
	console.log("processFiles: "+filename);
});
```

To improve logging control and to allow for better integration with other modules, introduced integration with `primitive_logger` See https://www.npmjs.com/package/primitive_logger. 

This module uses `"command_line_files"` message type, so to enable its logs, `"command_line_files"` should be added to the list of active types.

Examples of using module with logging:

```javascript
const lr = require('primitive_logger')
var clf = require('./clf.js');

// Example 4 : Enable "command_line_files" option in logger 
//             to make it print some diagnostics
clf.getFilesSync( {logger:{types:["command_line_files"]}}, (files) => {
	console.log("getFilesSync array 2: "+JSON.stringify(files));
	files.forEach( (file) => {
		console.log("getFilesSync for each: "+file);
	});
});

```

```javascript
const clf = require('command_line_files');
// Example 5 : Create logger and pass it over to command_line_files module 
//             with "command_line_files" option enabled.
var options = {
	logger: {
		types: ["command_line_files","info"],
		format: { 
			date: {show: true},
			type: {show: true}
		}
	},
	filesList: ["*"]
}
logger = new lr.Logger(options);
options.logger.instance = logger;

clf.processEachFile( options, (filename) => {
    logger.log("info", "Processing file: "+filename);
});
```

## getFilesSync( [options], [callback] )
The function is synchronous. I didn't come up with async use case so far. 
By default, only existing files on the file system are included in returned array.

* `options` `{Object}`
* `cb` `{Function}`
  * `err` `{Error | null}`
  * `matches` `{Array<String>}` all valid filenames, passed in on command line or with option filesList

## processEachFile( [options], [callback] )

* `options` `{Object}`
* `cb` `{Function}`
  * `err` `{Error | null}`
  * `matches` `{String}` a filename. The callback is invoked for each filename

## Command line patterns

See Glob Primer https://www.npmjs.com/package/glob for command line pattern matching rules.

## Options

* `options` The options object can be passed in to all functions
   * `logger` - `primitive_logger` option definitions. See https://www.npmjs.com/package/primitive_logger for details. 
		* `"command_line_files"` message type is used by this module. If logger.instance is not set, the new instance will be created using `logger` options. 
   * `validate` - when true, will make sure object exists on the local file system. Default: true
   * `slice` - can be used to identify how many command line parameters to skip. Default: 2 ("node" and your_script_name.js)
   * `files` - when true, will include valid filenames, assuming `validate` is true. Default: true
   * `dirs` - if true, will include valid directories, assuming `validate` is true. Default: false
   * `filesList` - when provided, utility will use this list instead of looking for command line arguments. 

## Windows

**Please only use forward-slashes in command line expressions.**

Again, please see Glob documentation for explanations https://www.npmjs.com/package/glob 

