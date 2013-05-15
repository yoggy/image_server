// config
var target_script = 'app.js';
var restart_interval = 3 * 60 * 60 * 1000; // ms

// 
var path = require('path'),
	fs   = require('fs');
var pid_file = path.join(__dirname, '.launcher.pid');

// parse command line
var optimist = require('optimist')
var argv = optimist
    .usage('usage: $0 [-f] {start|stop|restart}')
    .boolean('f')
    .argv;

if (argv.h || argv.help || argv._.length == 0) {
    optimist.showHelp();
    process.exit(0);
}
command = argv._[0];

var forever = require('forever-monitor');
var	child = new (forever.Monitor)(target_script, {
	max     : 1,
	silent  : true,
	});
child.on('exit', restart);

function start() {
	stop();

	// start daemon process, if -d
	if (!argv.f) {
		require('daemon')();
	}

	console.log("launcher.js : start()...target_script=" + target_script + ",pid=" + process.pid);

	// write pid 
	fs.writeFileSync(pid_file, process.pid);

	child.start();

	setInterval(function() {
		child.restart();
	}, restart_interval);
}

function stop() {
	if (fs.exists(pid_file)) {
		var pid = parseInt(fs.readFileSync(pid_file));
		console.log("launcher.js : stop()...target_pid=" + pid);
		process.kill(pid);
	}
}

function stopSelf() {
	child.stop();
	fs.unlinkSync(pid_file);
	process.exit();
}

process.on('SIGTERM', function() {
	console.log("launcher.js : trap SIGTERM...pid=" + process.pid);
	stopSelf();
});

process.on('SIGINT', function() {
	console.log("launcher.js : trap SIGINT...pid=" + process.pid);
	stopSelf();
});

function restart() {
	stop();
	start();
}

switch(command) {
	case 'start':
		start();
		break;
	case 'stop':
		stop();
		break;
	case 'restart':
		restart();
		break;
}
