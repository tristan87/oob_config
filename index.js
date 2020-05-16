// 2020 Tristan Davis | JPMC

//import app modules
const formatHostname =    require('./app/format_hostname');
const getLogName =        require('./app/get_log_name');
const getSetPassword =    require('./app/get_set_password');
const increment =         require('./app/increment');
const initialPrompt =     require('./app/initial_prompt');
const oobGetType =        require('./app/get_oob_type');
const override =          require('./app/override');
const parseCidr =         require('./app/parse_cidr');
const parseSessionText =  require('./app/parse_session_text');
const removeSuffix =      require('./app/remove_suffix');
const responseIs =        require('./app/get_response_bool');

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

//increment the hostname and IP then call confirmPrompt again
let startNextLoop = () => {
  config.currentHostname = increment(config.currentHostname);
  config.formattedHostname = formatHostname(config.currentHostname, config);
  config.currentIP = increment(config.currentIP);
  confirmUserPrompt();
};

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName('log')}`;

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
      console.log(parseSessionText(config, configObject, sessionText));
      startNextLoop();
    },
    SSH.connect(callback);
  }
  catch(error) {
      console.log(error);
  }
};

//create a confirmation string to show the user the current settings
let generateConfirmation = () => {
  let confirmation = `
    Hostname:         ${config.formattedHostname}
    IP Address:       ${config.currentIP}
    Subnet Mask:      ${config.netmask}
    Default Gateway:  ${config.gateway}
    Username:         ${config.setUsername}
  `;
  return confirmation;
};

//user prompt for password confirmation
let passwordConfirmPrompt = [
  {
    type:     (override.credsExist || !config.continue) ? false : 'text',
    name:     'confirmPassword',
    message:  'Please enter the admin password again:',
    style:    'password',
    validate: value => (value === config.setPassword) ? true : "Passwords do not match.",
    onState:  (state) => {if(state.aborted) {config.continue = false;}}
  }
];

//generate user prompt(s) to confirm the current configuration
let confirmPrompt = () => {
  return [
    {
      type:     (config.oobType === 'iLO' && config.continue) ? 'text' : false,
      name:     'password',
      message:  () => `Please scan the iLO password for ${config.formattedHostname}: `,
      style:    'password',
      onState:  (state) => {if(state.aborted) {config.continue = false;}}
    },
    {
      type:     (config.continue) ? 'text' : false,
      name:     'confirm',
      message:  () => `Push the following config to the currently connected ${config.oobType} (Y/N)? \n${generateConfirmation()}\n`,
      onState:  (state) => {if(state.aborted) {config.continue = false;}}
    }
  ];
};

//prompt the user for initial settings
let initialUserPrompt = async () => {
  try {
    const response = await prompts(initialPrompt(config));
      //set config object settings per user input
      config.oobType =                  oobGetType(response.oobType);
      config.currentHostname =          removeSuffix(response.hostname, config);
      config.formattedHostname =        formatHostname(response.hostname, config);
      config.currentIP =                response.ipAddress;
      config.netmask =                  parseCidr(response.netmask);
      config.gateway =                  response.gateway;
      config.setUsername =              override.setUsername(response.setUsername);
      config.setPassword =              override.setPassword(response.setPassword);
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
      const confirmPasswordResponse = await prompts(passwordConfirmPrompt);
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
      const confirm = await prompts(confirmPrompt());
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

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt(config).then(
  () => { confirmPassword().then(
    () => { confirmUserPrompt();
    }
  );}
);
