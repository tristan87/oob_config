/*jshint esversion: 8 */

//get the oobType from user input
module.exports = (input) => {
  let lowerCaseInput = input.toLowerCase();
  let dracResponses = ['1', 'idrac', 'drac', 'dra', 'dr', 'd', 'r', 'a', 'c'];
  let iloResponses = ['2', 'ilo', 'lo', 'l', 'o'];
  let responseMatches = (responseType, lowerCaseInput) => {
    return responseType.indexOf(lowerCaseInput) !== -1;
  };

  if (responseMatches(dracResponses, lowerCaseInput)) {
    return 'iDRAC';
  }
  if (responseMatches(iloResponses, lowerCaseInput)) {
    return 'iLO';
  }
};
