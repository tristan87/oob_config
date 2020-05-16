const getDatetime = require('./datetime');

//create a log name based on the current datetime and config extension
module.exports = (config) => {
  let projNum = config.projNum;
  let datetime = getDatetime();
  let logExt =  config.logExt;

  return `${projNum}_${datetime}.${logExt}`;
};
