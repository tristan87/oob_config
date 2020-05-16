//import the ip module for IP address utilities
const ip = require('ip');
//return the first address in a subnet
module.exports = (ipAddress, subnet) => {
  return ip.subnet(ipAddress, subnet).firstAddress;
};
