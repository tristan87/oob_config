//import app modules
const formatHostname =          require('./format_hostname');
const initialPrompt =           require('./initial_prompt');
const oobGetType =              require('./get_oob_type');
const override =                require('./override');
const parseCidr =               require('./parse_cidr');
const removeSuffix =            require('./remove_suffix');

//import external modules
//module for prompting the user
const prompts =   require('prompts');

//prompt the user for initial settings
module.exports = async (config) => {
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
