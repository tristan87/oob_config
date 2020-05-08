/*jshint esversion: 8 */

module.exports = (config) => {
  return {
    commands: [
      `racadm set iDRAC.NIC.Selection 1`,
      `racadm set iDRAC.IPv4.Enable 1`,
      `racadm set iDRAC.IPv4.DHCPEnable 0`,
      `racadm set iDRAC.IPv4.Address ${config.currentIP}`,
      `racadm set iDRAC.IPv4.Gateway ${config.gateway}`,
      `racadm set iDRAC.IPv4.Netmask ${config.netmask}`,
      `racadm set iDRAC.Users.2.Username ${config.setUsername}`,
      `racadm set iDRAC.Users.2.Password ${config.setPassword}`
    ],
    successRegex: /Object value modified successfully/g,
    commandRegex: /\/admin1->racadm/g,
    commandModifier: 1
  };
};
