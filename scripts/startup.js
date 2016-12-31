/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('node-exp:server');
/*
 * Change made by Chuck Barlow 12/24/2016:
 * Replaced the normal require('http') line here, with the
 * following alternate code to use https with properties
 * coming from the file config.json
 */
var fs = require('fs');
var https = require('https');
var config = require('../config/config.json');


/**
 * Get port from environment and store in Express.
 *
 * 12/24/2016 (CB) - note the config.port alternative added here.
 */

var port = normalizePort(process.env.PORT || config.port || '3000');
app.set('port', port);

/**
 * Create *HTTPS* server.
 *
 * 12/24/2016 (CB) - modified this section for https server.
 */

var keyFile = config.https.key;
config.https.key = fs.readFileSync(keyFile);
var certFile = config.https.cert;
config.https.cert = fs.readFileSync(certFile);
var caFile = config.https.ca;
config.https.ca = fs.readFileSync(caFile);
var server = https.createServer(config.https, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
