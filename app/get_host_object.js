//import app modules
const getSetPassword =  require('./get_set_password');
const getConfigObject =    require('./get_config_object');

module.exports = (config) => {
  // generate a config object based on user input
  let configObject = getConfigObject(config);
  let oobType = config.oobType;
  
  return {
    server: {
      host:     config[oobType].defaultIP,
      userName: config[oobType].defaultUsername,
      password: getSetPassword(config),
      port:     config.sshPort
    },
    commands:   configObject.commands
  };
};
