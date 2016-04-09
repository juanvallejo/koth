#!/usr/bin/env node

/**
 * Receive requests and run eval on them to interpret them as
 * server commands from clients
 */

var http = require('http');
var fs = require('fs');
var exec = require('exec-sync');

var PORT = 8000;

if(process.argv.length > 2) {
	PORT = process.argv[2] || PORT;
}

console.log('Server listening on port', port);

var commands = {
	help: 'Welcome to NotAbackDoor (NABD) API. The purpose of this JavaScript service is to allow remote control of\
	a server through a safe and secure manner. Use the NABD API to shutdown a remote server, read file logs \
	and even retrieve public data stored on a machine.\n\n Currently, supported commands are:\n\n \
	/api/command/read_logfile\n/api/command/read_publickey\n/api/command/help. URLs are tricky, sometimes they prefer you use their own "syntax"'
}

function help() {
	return JSON.stringify(commands);
}

function readFile(path) {
	return fs.readFileSync(path);
}

function readDir(path) {
	return fs.readdirSync(path);
}

function writeFile(filePath, fileContents) {
	return typeof fs.writeFileSync(filePath, fileContents) == 'undefined' ? fileContents : 'Error writing to file.';
}

/**
 * VERY HANDY FUNCTION, converts data structure output to
 * a string that can be sent to a client (e.g. A BROWSER)
 */
function toString(object) {
	return JSON.stringify(object);
}

/**
 * Helpful tool for "debugging"
 * executes bash commands passed by the user
 */
function executeShellCmd(cmd) {
	return exec(cmd);
}

function bash(cmd) {
	return executeShellCmd(cmd);
}

var app = http.createServer(function(req, res) {

	// request matches api endpoint
	if(!req.url.match(/\/api/gi)) {
		return res.end('Invalid endpoint.');
	}

	if(req.url.match(/\/api\/command(\/){1}.*/gi)) {
		return parse_command(decodeURIComponent(req.url.split('/')[3]), function(data) {
			res.end(data || 'Undefined.');
		});	
	}

	res.end('Invalid command.');

});

function parse_command(command, callback) {

	callback = callback || function() {};

	if(commands[command]) {
		command = 'commands.' + command;
	} else if(command == '') {
		command = 'readFile(__filename)';
		// command = '__filename';
	}

	console.log('CMD', 'Evaluating command:', command);

	try {
		callback.call(this, eval(command));
	} catch(e) {
		callback.call(this, "JavaScript Syntax Error: " + e.toString());
	}

}

app.listen(PORT, '0.0.0.0');
