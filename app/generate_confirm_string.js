//create a confirmation string to show the user the current settings
module.exports = (config) => {
  let confirmation = `
    Hostname:         ${config.formattedHostname}
    IP Address:       ${config.currentIP}
    Subnet Mask:      ${config.netmask}
    Default Gateway:  ${config.gateway}
    Username:         ${config.setUsername}
  `;
  return confirmation;
};
