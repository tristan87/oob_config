//import the hostname and IP parsing module
const parse = require('./parse');

//increment an IP or hostname by 1, retaining any zero padding
module.exports = (string) => {
  let parsed = parse(string);
  let base = string.substring(0, parsed.index);
  let incrementation = parsed.int + 1;
  let padded = incrementation.toString().padStart(parsed.intPadding, '0');
  return `${base}${padded}`;
};
