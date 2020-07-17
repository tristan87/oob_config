module.exports = (config) => {
  let oobType = config.oobType;
  // load the appropriate oob module for the oob type selected
  let oobConfig = require(config[oobType].modulePath);
  // generate a config object based on user input
  let configObject = oobConfig(config);

  return configObject;
};
