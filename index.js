// 2020 Tristan Davis | JPMC
// bug reports and feature requests: tristan.f.davis@jpmchase.com
/*jshint esversion: 8 */

//import the configuration object from the config.js file
let config =              require('./config');

//import the hostname formatting module
const formatHostname =    require('./app/hostname');
//import the logname module for creating log names based on the current datetime
const getLogName =        require('./app/logname');
//import the hostname and IP incrementing module
const increment =         require('./app/increment');
//import the out-of-band type module
const oobSetType =        require('./app/oobtype');
//import the module for parsing negative and positive user responses
const parseResponse =     require('./app/responsebool');
//import the module for parsing ssh session text
const parseSessionText =  require('./app/parse_session_text');
//import the module for selecting the correct password to push
const password =          require('./app/password');

//import the graceful-fs module for creating log files
const fs =                require('graceful-fs');
//import the ip module for IP address utilities
const ip =                require('ip');
//import the prompts module to enable user input
const prompts =           require('prompts');
//import the ssh2shell module for ssh functionality
const ssh2shell =         require('ssh2shell');

console.log(config.greeting);

//if the user typed a suffix to indicate the remote out-of-band hostname, remove it
let removeSuffix = (string) => {
  let regex = config.hostnameSuffix;
  return (string.match(regex)) ? string.replace(regex, '') : string;
};

//return the first address in a subnet
let guessGateway = (ipAddress, subnet) => {
  return ip.subnet(ipAddress, subnet).firstAddress;
};

//if the user enters the subnet in CIDR notation, convert it to dotted decimal
let parseCIDR = (subnet) => {
  if (ip.isV4Format(subnet)) {
    return subnet;
  }
  else {
    let numberOnly = subnet.replace(/\D/g,'');
    return ip.fromPrefixLen(numberOnly);
  }
};

//increment the hostname and IP then call confirmPrompt again
let startNextLoop = () => {
  config.currentHostname = increment(config.currentHostname);
  config.formattedHostname = formatHostname(config.currentHostname, config);
  config.currentIP = increment(config.currentIP);
  confirmUserPrompt();
};

//set the log file name and path
config.logPath = `${__dirname}/logs/${getLogName('log')}`;

let pushConfig = async (config) => {
  let oobType = config.oobType;
  // load the appropriate oob module for the oob type selected
  let oobConfig = require(config[oobType]['modulePath']);
  // generate a config object based on user input
  let configObject = oobConfig(config);

  let host = {
    server: {
      host:     config[oobType].defaultIP,
      userName: config[oobType].defaultUsername,
      password: password(config),
      port:     config.sshPort
    },
    commands:   configObject.commands
  };

  try {
    SSH = new ssh2shell(host),
    callback = (sessionText) => {

      fs.appendFile(config.logPath, sessionText, (error) => {
        if (error) {console.log(`Log Error: ${error}`);}
      });
      console.log(parseSessionText(config, configObject, sessionText));
      startNextLoop();
    },
    SSH.connect(callback);
  }
  catch(error) {
      console.log(error);
  }
};

//create a confirmation string to show the user the current settings
let generateConfirmation = () => {
  let confirmation = `
    Hostname:         ${config.formattedHostname}
    IP Address:       ${config.currentIP}
    Subnet Mask:      ${config.netmask}
    Default Gateway:  ${config.gateway}
    Username:         ${config.setUsername}
  `;
  return confirmation;
};

//array of user prompts for initial configuration
const initialPrompt = [
  {
    type:     'text',
    name:     'oobType',
    message:  'Do you want to configure a iDRAC (1) or an iLO (2)?',
  },
  {
    type:     'text',
    name:     'hostname',
    message:  `Please enter the first hostname in the series: `,
  },
  {
    type:     'text',
    name:     'ipAddress',
    message:  (prev) => `Please enter the IP address for ${formatHostname(prev, config)}: `,
    validate: value => ip.isV4Format(value) ? true : 'Please enter a valid IP address.',
  },
  {
    type:     'text',
    name:     'netmask',
    message:  'Please enter the subnet mask (dotted decimal or CIDR format): ',
    initial:  '255.255.255.0',
    validate: value => ip.isV4Format(parseCIDR(value)) ? true : 'Please enter a valid IP address.'
  },
  {
    type:     'text',
    name:     'gateway',
    message:  'Please enter the default gateway: ',
    initial:  (prev, values) => `${guessGateway(values.ipAddress, parseCIDR(values.netmask))}`,
    validate: value => ip.isV4Format(value) ? true : 'Please enter a valid IP address.'
  },
  {
    type:     'text',
    name:     'setUsername',
    message:  'Please enter the admin username to set for this series of hosts:',
  },
  {
    type:     'text',
    name:     'setPassword',
    message:  'Please enter the admin password to set for this series of hosts:',
    style:    'password'
  }
];

//user prompt for password confirmation
let passwordConfirmPrompt = [
  {
    type:     'text',
    name:     'confirmPassword',
    message:  'Please enter the admin password again:',
    style:    'password',
    validate: value => (value === config.setPassword) ? true : "Passwords do not match."
  }
];

//generate user prompt(s) to confirm the current configuration
let confirmPrompt = () => {
  return [
    {
      type:     () => (config.oobType === 'iLO') ? 'text' : false,
      name:     'password',
      message:  () => `Please scan the iLO password for ${config.formattedHostname}: `,
      style:    'password',
    },
    {
      type:     'text',
      name:     'confirm',
      message:  () => `Push the following config to the currently connected ${config.oobType} (Y/N)? \n${generateConfirmation()}\n`,
    }
  ];
};

//prompt the user for initial settings
let initialUserPrompt = async () => {
  try {
    const response = await prompts(initialPrompt);
      //set config object settings per user input
      config.oobType =                  oobSetType(response.oobType);
      config.currentHostname =          removeSuffix(response.hostname);
      config.formattedHostname =        formatHostname(response.hostname, config);
      config.currentIP =                response.ipAddress;
      config.netmask =                  parseCIDR(response.netmask);
      config.gateway =                  response.gateway;
      config.setUsername =              response.setUsername;
      config.setPassword =              response.setPassword;
  }
  catch(error) {
    console.log(error);
  }

};

//prompt the user to confirm the password they entered
let confirmPassword = async() => {
  try {
    const confirmPasswordResponse = await prompts(passwordConfirmPrompt);
  }
  catch(error) {
    console.log(error);
  }
};

//prompt the user to confirm the current configuration
let confirmUserPrompt = async () => {
  try {
    const confirm = await prompts(confirmPrompt());
    config.currentPassword = (confirm.password) ? confirm.password : config.iDRAC.defaultPassword;
    //exit the script if the user chooses not to push the current configuration
    if (parseResponse.isNegative(confirm.confirm)) {
      console.log('Exiting script.');
    }
    //if the user chooses to push the current confiruation,
    //make the ssh connection and push the settings
    if (parseResponse.isPositive(confirm.confirm)) {
      pushConfig(config);
    }
  }
  catch(error) {
    console.log(error);
  }
};

//prompt the user for initial settings, then cofirm the current settings
initialUserPrompt().then(
  () => { confirmPassword().then(
    () => { confirmUserPrompt();
    }
  );}
);
