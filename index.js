// 2020 Tristan Davis | JPMC

//import app modules
const confirmPassword =   require('./app/confirm_password');
const confirmUserPrompt = require('./app/confirm_user_prompt');
const getLogName =        require('./app/get_log_name');
const initialUserPrompt = require('./app/initial_user_prompt');
const override =          require('./app/override');

//import the configuration settings
let config = require(override.configPath);

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName(config)}`;

//display the welcome message to the user
console.log(config.greeting);

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt(config).then(
  () => { confirmPassword(config).then(
    () => { confirmUserPrompt(config); }
  );}
);
