//see the readme for help modifying this configuration
module.exports = {
  greeting: 'Welcome to the out-of-band configuration script.\nPress "CTRL+C" at any time to exit.\n',
  sshPort: 22,
  currentPassword: false,
  hostnameSuffix: /-r$/,
  currentHostname: '',
  formattedHostname: '',
  currentIP: '',
//do not set credentials here in config.js. see the readme for more details.
  setUsername: '',
  setPassword: '',
  netmask: '255.255.255.0',
  gateway: '',
  oobType: '',
  logPath: '',
  logExt: 'log',
  continue: true,

    iDRAC: {
      modulePath: './idrac',
      defaultIP: '169.254.0.3',
      defaultUsername: 'root',
      defaultPassword: 'calvin'
    },
    iLO: {
      modulePath: './ilo',
      defaultIP: '169.254.1.2',
      defaultUsername: 'Administrator',
      defaultPassword: false
    },
};
