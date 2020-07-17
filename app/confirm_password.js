//import app modules
const generatePWConfirmPrompt = require('./generate_pw_confirm_prompt');
const override =                require('./override');

//import external modules
//module for prompting the user
const prompts =   require('prompts');

//prompt the user to confirm the password they entered
module.exports = async(config) => {
  if (config.continue) {
    try {
      const confirmPrompt = generatePWConfirmPrompt(config, override);
      const confirmPasswordResponse = await prompts(confirmPrompt);
    }
    catch(error) {
      config.continue = false;
      console.log(error);
    }
  }
};
