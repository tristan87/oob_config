// 2020 Tristan Davis | JPMC

//import app modules
const confirmPassword =   require('./app/confirm_password');
const confirmUserPrompt = require('./app/confirm_user_prompt');
const formatHostname =    require('./app/format_hostname');
const getLogName =        require('./app/get_log_name');
const increment =         require('./app/increment');
const initialUserPrompt = require('./app/initial_user_prompt');
const override =          require('./app/override');
const responseIs =        require('./app/get_response_bool');

//import external modules
//module for IP address utilities
const ip =      require('ip');
//module for prompting the user
const prompts = require('prompts');

//import the configuration settings
let config = require(override.configPath);

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName(config)}`;

//display the welcome message to the user
console.log(config.greeting);

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
      confirmUserPrompt(config);
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
  confirmUserPrompt(config);
};

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt(config).then(
  () => { confirmPassword(config).then(
    () => { confirmUserPrompt(config); }
  );}
);
