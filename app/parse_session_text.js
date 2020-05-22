module.exports = (config, configObject, sessionText) => {
//get regexes from the configuration to parse the session text.
  let successRegex = configObject.successRegex;
  let commandRegex = configObject.commandRegex;
//create the message template for displaying a failure and log path to the user
  let failureMsg = `An error has occurred. See ${config.logPath} for details.\n`;
//create the failure object to return
  let totalFailureObj =   { success: false, message: failureMsg};
//if a success and a failure regex are matched in the session text, display a
//success or failure message
  if (sessionText.match(successRegex) !== null && sessionText.match(commandRegex) !== null) {
//increase or decrease the count of commands based on the type of out-of-band
//interface
    let modifier =        configObject.commandModifier;
//parse the session text and count the number of matching success and command
//strings, with modifier for the latter
    let successMsgs =     sessionText.match(successRegex).length;
    let totalCommands =   sessionText.match(commandRegex).length + modifier;
//create the message templates for displaying various scenarios to the user.
    let successMsg = `${successMsgs} of ${totalCommands} configuration items set successfully!\nSee ${config.logPath} for details.\n`;
//establish the logic by which success and failure will be determined
    let totalSuccess =    (successMsgs && successMsgs === totalCommands);
    let partialSuccess =  (successMsgs && successMsgs < totalCommands);
    let totalFailure =    (!successMsgs || successMsgs === 0);
//create the success objects to return
    let totalSuccessObj =   { success: true,  message: successMsg};
    let partialSuccessObj = { success: false, message: successMsg};
//return the appropriate object based on the success or failure status
    if (totalSuccess)   return totalSuccessObj;
    if (partialSuccess) return partialSuccessObj;
    if (totalFailure)   return totalFailureObj;
  }
  else {
    return totalFailureObj;
  }
};
