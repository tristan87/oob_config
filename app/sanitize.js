/*jshint esversion: 8 */

//relace passwords in ssh output with asterisks
module.exports = (oobModule, sessionText) => {
  return sessionText.replace(oobModule.passwordRegex, '**********');
};
