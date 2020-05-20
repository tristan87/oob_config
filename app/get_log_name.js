const getDatetime = require('./datetime');

//create a log name based on the current datetime and config extension
module.exports = (config) => {
  let datetime = getDatetime();
  let logExt =  config.logExt;

  return `${datetime}.${logExt}`;
};
