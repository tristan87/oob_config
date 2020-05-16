//import the ip module for IP address utilities
const ip = require('ip');

//if the user enters the subnet in CIDR notation, convert it to dotted decimal
module.exports = (subnet) => {
  if (subnet !== undefined) {
    if (ip.isV4Format(subnet)) {
      return subnet;
    }
    else {
      let numberOnly = subnet.replace(/\D/g,'');
      return ip.fromPrefixLen(numberOnly);
    }
  }
};
