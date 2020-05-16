module.exports = {
  greeting: 'Welcome to the out-of-band configuration script.\nPress "CTRL+C" at any time to exit.\n',
  sshPort: 22,
  currentPassword: false,
  hostnameSuffix: /-r$/,
  currentHostname: '',
  formattedHostname: '',
  currentIP: '',
//do not set credentials here, they will be ignored. if default credentails are
//required, create a config_override.js file. see the readme for more details
  setUsername: '',
  setPassword: '',
  netmask: '255.255.255.0',
  gateway: '',
  oobType: '',
  logPath: '',
  logExt: 'log',
  continue: true,

    iDRAC: {
      modulePath: './app/idrac',
      defaultIP: '169.254.0.3',
      defaultUsername: 'root',
      defaultPassword: 'calvin'
    },
    iLO: {
      modulePath: './app/ilo',
      defaultIP: '169.254.1.2',
      defaultUsername: 'Administrator'
    },
};
