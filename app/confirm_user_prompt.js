
//import app modules
const generateConfirmPrompt = require('./generate_confirm_prompt');
const pushConfig =            require('./push_config');
const responseIs =            require('./get_response_bool');

//import external modules
//module for prompting the user
const prompts =   require('prompts');

//prompt the user to confirm the current configuration
module.exports = async (config) => {
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
