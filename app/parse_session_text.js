/*jshint esversion: 8 */

//parse a hostname/IP and return an object of its constituents and properties
module.exports = (config, configObject, sessionText) => {
  let successRegex = configObject.successRegex;
  let commandRegex = configObject.commandRegex;
  let failure = `An error has occurred. See ${config.logPath} for details.\n`;

  if (sessionText.match(successRegex) !== null && sessionText.match(commandRegex) !==null) {
    let successRegex = configObject.successRegex;
    let commandRegex = configObject.commandRegex;
    let modifier = configObject.commandModifier;
    let successMessages = sessionText.match(successRegex).length;
    let totalCommands = sessionText.match(commandRegex).length + modifier;
    let success = `${successMessages} of ${totalCommands} configuration items set successfully!\nSee ${config.logPath} for details.\n`;
    return success;
  }
  else {
    return failure;
  }
};
