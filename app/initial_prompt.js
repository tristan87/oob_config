//import app modules
const parseCidr =       require('./parse_cidr');
const formatHostname =  require('./format_hostname');
const guessGateway =    require('./guess_gateway');
const override =        require('./override');

//import external modules
const ip = require('ip');

//return an array of user prompts for initial configuration
module.exports = (config) => {
let initialPrompt = [
  {
    type:     'text',
    name:     'oobType',
    message:  'Do you want to configure a iDRAC (1) or an iLO (2)?',
  },
  {
    type:     (config.continue) ? 'text' : false,
    name:     'hostname',
    message:  `Please enter the first hostname in the series: `,
    initial:  (config.currentHostname) ? config.currentHostname : ''
  },
  {
    type:     (config.continue) ? 'text' : false,
    name:     'ipAddress',
    message:  (prev) => `Please enter the IP address for ${formatHostname(prev, config)}: `,
    initial:  (config.currentIP) ? config.currentIP : '',
    validate: value => ip.isV4Format(value) ? true : 'Please enter a valid IP address.',
  },
  {
    type:     (config.continue) ? 'text' : false,
    name:     'netmask',
    message:  'Please enter the subnet mask (dotted decimal or CIDR format): ',
    initial:  (config.netmask) ? config.netmask : '',
    validate: value => ip.isV4Format(parseCidr(value)) ? true : 'Please enter a valid IP address.'
  },
  {
    type:     (config.continue) ? 'text' : false,
    name:     'gateway',
    message:  'Please enter the default gateway: ',
    initial:  (prev, values) => `${guessGateway(values.ipAddress, parseCidr(values.netmask))}`,
    validate: value => ip.isV4Format(value) ? true : 'Please enter a valid IP address.'
  },
  {
    type:     (override.credsExist || !config.continue) ? false : 'text',
    name:     'setUsername',
    message:  'Please enter the admin username to set for this series of hosts:',
  },
  {
    type:     (override.credsExist || !config.continue) ? false : 'text',
    name:     'setPassword',
    message:  'Please enter the admin password to set for this series of hosts:',
    style:    'password'
  }
];

//set config.continue to false if a prompt is aborted by the user
let abortMethod = (state) => {if(state.aborted) {config.continue = false;}};
//attach abortMethod to each prompt in the prompts array
let attachAbortMethod = (prompts) => prompts.map(prompt => ({...prompt, onState: abortMethod}));

return attachAbortMethod(initialPrompt);
};
