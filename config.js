/*jshint esversion: 8 */

module.exports = {
  greeting: 'Welcome to the out-of-band configuration script.\nPress "CTRL+C" at any time to exit.\n',
  sshPort: 22,
  currentPassword: false,
  hostnameSuffix: /-r$/,
  currentHostname: '',
  formattedHostname: '',
  currentIP: '',
  setUsername: '',
  setPassword: '',
  netmask: '',
  gateway: '',
  oobType: '',
  logPath: '',

    iDRAC: {
      modulePath: './app/idrac',
      defaultIP: '192.168.0.120',
      defaultUsername: 'root',
      defaultPassword: 'calvin'
    },
    iLO: {
      modulePath: './app/ilo',
      defaultIP: '169.254.1.2',
      defaultUsername: 'Administrator'
    },
};
