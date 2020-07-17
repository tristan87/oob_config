//import app modules
const getConfigObject =   require('./get_config_object');
const getHostObject =     require('./get_host_object');
const parseSessionText =  require('./parse_session_text');
//import external modules
//module for creating log files
const fs =        require('graceful-fs');
//module for ssh functionality
const ssh2shell = require('ssh2shell');

//send the configuration setting commands via an ssh session
let pushConfig = async (config) => {
  // generate a config object based on user input
  let configObject = getConfigObject(config);

  let host = getHostObject(config);

  try {
    SSH = new ssh2shell(host),
    callback = (sessionText) => {
      fs.appendFile(config.logPath, sessionText, (error) => {
        if (error) {console.log(`Log Error: ${error}`);}
      });
      let sshResponseObj = parseSessionText(config, configObject, sessionText);
      console.log(sshResponseObj.message);
      if (sshResponseObj.success === true) {
        startNextLoop(config);
      }
      else {
        retryPrompt(config);
      }
    },
    SSH.connect(callback);
  }
  catch(error) {
      console.log(error);
  }
};
