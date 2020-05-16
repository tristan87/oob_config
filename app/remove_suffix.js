//if the user typed a suffix to indicate the remote out-of-band hostname, remove
//it
module.exports = (string, config) => {
  if (string !== undefined) {
    let regex = config.hostnameSuffix;
    return (string.match(regex)) ? string.replace(regex, '') : string;
  }
};
