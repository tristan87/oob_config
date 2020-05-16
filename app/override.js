//import the graceful-fs module for file operations
const fs = require('graceful-fs');

//return a bool based on whether the override file exists
let overrideFileExists = fs.existsSync('./config_override.js');
//set the config path
let configPath = (overrideFileExists) ? './config_override' : './config';

//import the config object
let config = require(`.${configPath}`);

//if the override file exists and contains credentials, return true
let overrideCredsExist = (
  overrideFileExists &&
  config.setUsername !== '' &&
  config.setPassword !== ''
);

//if default credentials exist in config_override, return them, otherwise return
//the credentials typed by the user.
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
};
