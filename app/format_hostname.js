//ensure the hostname is lowercase and ends in the correct suffix
module.exports = (hostname, config) => {
  if (hostname !== undefined && config !== undefined) {
    let lowerCaseHostname = hostname.toLowerCase();
    let regex = config.hostnameSuffix;
    let metacharacters = /\\|\^|\$|\.|\||\?|\*|\+|\(|\)|\[|\{/g;
    let suffix = regex.source.replace(metacharacters, '');
    let match = lowerCaseHostname.match(regex);
    return (match) ? lowerCaseHostname : `${lowerCaseHostname + suffix}`;
  }
};
