// 2020 Tristan Davis | JPMC

//import app modules
const confirmPassword =       require('./app/confirm_password');
const formatHostname =        require('./app/format_hostname');
const generateConfirmPrompt = require('./app/generate_confirm_prompt');
const getConfigObject =       require('./app/get_config_object');
const getLogName =            require('./app/get_log_name');
const getHostObject =         require('./app/get_host_object');
const increment =             require('./app/increment');
const initialUserPrompt =     require('./app/initial_user_prompt');
const override =              require('./app/override');
const parseSessionText =      require('./app/parse_session_text');
const responseIs =            require('./app/get_response_bool');

//import external modules
//module for creating log files
const fs =        require('graceful-fs');
//module for prompting the user
const prompts =   require('prompts');
//module for ssh functionality
const ssh2shell = require('ssh2shell');

//import the configuration settings
let config = require(override.configPath);

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName(config)}`;

//display the welcome message to the user
console.log(config.greeting);

//increment the hostname and IP then call confirmUserPrompt again
let startNextLoop = () => {
  config.currentHostname = increment(config.currentHostname);
  config.formattedHostname = formatHostname(config.currentHostname, config);
  config.currentIP = increment(config.currentIP);
  confirmUserPrompt();
};

//generate a user prompt to retry after a failure
let retryPrompt = async () => {
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
      startNextLoop();
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

//send the configuration setting commands via an ssh session
let pushConfig = async () => {
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
        startNextLoop();
      }
      else {
        retryPrompt();
      }
    },
    SSH.connect(callback);
  }
  catch(error) {
      console.log(error);
  }
};

//prompt the user to confirm the current configuration
let confirmUserPrompt = async () => {
  if (config.continue) {
    try {
      const confirm = await prompts(generateConfirmPrompt(config));
      let oobType = config.oobType;
      let defaultPassword = config[oobType].defaultPassword;
      config.currentPassword = (confirm.password) ? confirm.password : defaultPassword;
      //exit the script if the user chooses not to push the current configuration
      if (responseIs.negative(confirm.confirm)) {
        config.continue = false;
        console.log('Exiting script.');
      }
      //if the user chooses to push the current confiruation,
      //make the ssh connection and push the settings
      if (responseIs.positive(confirm.confirm)) {
        try {
          pushConfig();
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

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt(config).then(
  () => { confirmPassword(config).then(
    () => { confirmUserPrompt(); }
  );}
);
