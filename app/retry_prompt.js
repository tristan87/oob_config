//import app modules
const confirmUserPrompt = require('./confirm_user_prompt');
const responseIs =        require('./get_response_bool');
const startNextLoop =     require('./start_next_loop');

//import external modules
//module for prompting the user
const prompts = require('prompts');

//generate a user prompt to retry after a failure
module.exports = async (config) => {
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
