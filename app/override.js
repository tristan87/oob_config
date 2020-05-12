/*jshint esversion: 8 */

//import the graceful-fs module for file operations
const fs = require('graceful-fs');

//set the config path to config_override.js, if it exists, and from config.js
//otherwise
let overrideFileExists = fs.existsSync('./config_override.js')
let configPath = (overrideFileExists) ? './config_override' : './config';

//import the config object
let config = require(`.${configPath}`);

//if the override file and set credentials exist, return true
let overrideCredsExist = (
  overrideFileExists &&
  config.setUsername !== '' &&
  config.setPassword !== ''
);

//if the default credentials exist, return them, otherwise return the override
//credentials
let setUsername = (typedUsername = '') => {
  return (typedUsername === '') ? config.setUsername : typedUsername;
};
let setPassword = (typedPassword = '') => {
  return (typedPassword === '') ? config.setPassword : typedPassword;
};

//export the vaious override functions
module.exports = {
  configPath: configPath,
  credsExist: overrideCredsExist,
  setUsername: setUsername,
  setPassword: setPassword
}
