/*jshint esversion: 8 */

//return the last scanned password if it exists, otherwise return the default
module.exports = (config) => {
  return (
    config.currentPassword ?
      config.currentPassword :
      config[config.oobType]['defaultPassword']
  );
};
