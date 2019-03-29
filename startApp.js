/**
 * @module
 */
var _ = require('lodash');
var pkg = require('./package.json');
var getCarbonEnvVars = require('carbon_web/env');

/**
 * Function for setting up environmental vars
 * @returns {void}
 */
function setUpEnvVars() {
  var possibleNodeEnvs = ['local', 'dev', 'qa', 'prod'];
  var msg;
  var carbonEnvVars;

  // if NODE_ENV was not provided, use 'dev'
  var nodeEnv = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  // if there was a NODE_ENV provided but it is not one of the allowed options
  if (!_.contains(possibleNodeEnvs, nodeEnv)) {
    msg = "Your NODE_ENV is set to '" + nodeEnv + "' which is invalid.  The only valid options are: " + possibleNodeEnvs.toString();
    throw new Error(msg);
  }

  // grab and set vars from package.json.  They are needed for other env vars
  process.env.APP_NAME = pkg.name;
  process.env.VERSION = pkg.version;

  carbonEnvVars = getCarbonEnvVars();

  // merge all variables together
  process.env = _.merge(
    carbonEnvVars.defaultVars,
    carbonEnvVars[nodeEnv],
    process.env
  );
}

setUpEnvVars();

// start the server
require('./server.js');
