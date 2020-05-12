/*jshint esversion: 8 */

//parse an ssh session's text for success and failure messages and display the
//result to the user
module.exports = (config, configObject, sessionText) => {
  let successRegex = configObject.successRegex;
  let commandRegex = configObject.commandRegex;
  let failure = `An error has occurred. See ${config.logPath} for details.\n`;

//if a success and a failure regex are matched in the session text, display the
//success message
  if (sessionText.match(successRegex) !== null && sessionText.match(commandRegex) !==null) {
    let successRegex = configObject.successRegex;
    let commandRegex = configObject.commandRegex;
    let modifier = configObject.commandModifier;
    let successMessages = sessionText.match(successRegex).length;
    let totalCommands = sessionText.match(commandRegex).length + modifier;
    let success = `${successMessages} of ${totalCommands} configuration items set successfully!\nSee ${config.logPath} for details.\n`;
    return success;
  }
//if a success and a failure regex are not matched in the session text, display
//the failure message
  else {
    return failure;
  }
};
