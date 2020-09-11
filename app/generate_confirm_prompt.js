//import the module for displaying the current settings to the user
const generateConfirmation = require('./generate_confirm_string');

//generate user prompt(s) to confirm the current configuration
module.exports = (config) => {
  let oobType = config.oobType;
  let defaultPassword = config[oobType].defaultPassword;

  return [
    {
      type:     (oobType === 'iLO' && !defaultPassword && config.continue) ? 'text' : false,
      name:     'password',
      message:  () => `Please scan the iLO password for ${config.formattedHostname}: `,
      style:    'password',
      onState:  (state) => {if(state.aborted) {config.continue = false;}}
    },
    {
      type:     (config.continue) ? 'text' : false,
      name:     'confirm',
      message:  () => `Push the following config to the currently connected ${config.oobType} (Y/N)? \n${generateConfirmation(config)}\n`,
      onState:  (state) => {if(state.aborted) {config.continue = false;}}
    }
  ];
};
