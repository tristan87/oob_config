//import app modules
const confirmUserPrompt = require('./confirm_user_prompt');
const formatHostname =    require('./format_hostname');
const increment =         require('./increment');

//increment the hostname and IP then call confirmUserPrompt again
module.exports = (config) => {
  config.currentHostname = increment(config.currentHostname);
  config.formattedHostname = formatHostname(config.currentHostname, config);
  config.currentIP = increment(config.currentIP);
  confirmUserPrompt(config);
};
