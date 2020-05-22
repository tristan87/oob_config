// 2020 Tristan Davis | JPMC

//import app modules
const formatHostname =          require('./app/format_hostname');
const generateConfirmPrompt =   require('./app/generate_confirm_prompt');
const generatePWConfirmPrompt = require('./app/generate_pw_confirm_prompt');
const getLogName =              require('./app/get_log_name');
const getSetPassword =          require('./app/get_set_password');
const increment =               require('./app/increment');
const initialPrompt =           require('./app/initial_prompt');
const oobGetType =              require('./app/get_oob_type');
const override =                require('./app/override');
const parseCidr =               require('./app/parse_cidr');
const parseSessionText =        require('./app/parse_session_text');
const removeSuffix =            require('./app/remove_suffix');
const responseIs =              require('./app/get_response_bool');

//import external modules
//module for creating log files
const fs =        require('graceful-fs');
//module for IP address utilities
const ip =        require('ip');
//module for prompting the user
const prompts =   require('prompts');
//module for ssh functionality
const ssh2shell = require('ssh2shell');

//import the configuration settings
let config = require(override.configPath);

//display the welcome message to the user
console.log(config.greeting);

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName(config)}`;

//prompt the user for initial settings
let initialUserPrompt = async (config) => {
  try {
    const response = await prompts(initialPrompt(config));
      //set config object settings per user input
      config.oobType =            oobGetType(response.oobType);
      config.currentHostname =    removeSuffix(response.hostname, config);
      config.formattedHostname =  formatHostname(response.hostname, config);
      config.currentIP =          response.ipAddress;
      config.netmask =            parseCidr(response.netmask);
      config.gateway =            response.gateway;
      config.setUsername =        override.setUsername(response.setUsername);
      config.setPassword =        override.setPassword(response.setPassword);
  }
  catch(error) {
    config.continue = false;
    console.log(error);
  }
};

//prompt the user to confirm the password they entered
let confirmPassword = async() => {
  if (config.continue) {
    try {
      const confirmPasswordResponse = await prompts(generatePWConfirmPrompt(config, override));
    }
    catch(error) {
      config.continue = false;
      console.log(error);
    }
  }
};

//prompt the user to confirm the current configuration
let confirmUserPrompt = async () => {
  if (config.continue) {
    try {
      const confirm = await prompts(generateConfirmPrompt(config));
      config.currentPassword = (confirm.password) ? confirm.password : config.iDRAC.defaultPassword;
      //exit the script if the user chooses not to push the current configuration
      if (responseIs.negative(confirm.confirm)) {
        config.continue = false;
        console.log('Exiting script.');
      }
      //if the user chooses to push the current confiruation,
      //make the ssh connection and push the settings
      if (responseIs.positive(confirm.confirm)) {
        try {
          pushConfig(config);
        }
        catch(error) {
          config.continue = false;
          console.log(error);
        }
      }
    }
    catch(error) {
      config.continue = false;
      console.log(error);
    }
  }
};

let pushConfig = async (config) => {
  let oobType = config.oobType;
  // load the appropriate oob module for the oob type selected
  let oobConfig = require(config[oobType].modulePath);
  // generate a config object based on user input
  let configObject = oobConfig(config);

  let host = {
    server: {
      host:     config[oobType].defaultIP,
      userName: config[oobType].defaultUsername,
      password: getSetPassword(config),
      port:     config.sshPort
    },
    commands:   configObject.commands
  };

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

//generate a user prompt to retry after a failure
let retryPrompt = async (config) => {
  let retryPromptArr = [
    {
      type: 'text',
      name: 'retry',
      message: `Would you like to try configuring ${config.currentHostname} again?`
    }
  ];
  try {
    const response = await prompts(retryPromptArr);
    let retryResponse = response.retry;
    if (responseIs.negative(retryResponse)) {
      console.log("Continuing to next host. Press \"CTRL+C\" at any time to exit.");
      startNextLoop(config);
    }
    if (responseIs.positive(retryResponse)) {
      confirmUserPrompt();
    }
  }
  catch(error) {
    config.continue = false;
    console.log(error);
  }
};

//increment the hostname and IP then call confirmUserPrompt again
let startNextLoop = (config) => {
  config.currentHostname = increment(config.currentHostname);
  config.formattedHostname = formatHostname(config.currentHostname, config);
  config.currentIP = increment(config.currentIP);
  confirmUserPrompt();
};

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt(config).then(
  () => { confirmPassword().then(
    () => { confirmUserPrompt(); }
  );}
);
