//parse a hostname/IP and return an object of its constituents and properties
module.exports = (string) => {
  let regex = /\d+$/;
  let match = string.match(regex);
  return {
    match: match,
    str: match[0],
    int: parseInt(match[0], 10),
    intPadding: match[0].length,
    index: match.index
  };
};
