/*jshint esversion: 8 */

//check user input for a positive response
let isPositive = (response) => {
  let lowerCaseResponse = response.toLowerCase();
  let positiveResponses = ['y', 'ye', 'yes', '1'];
  return positiveResponses.indexOf(lowerCaseResponse) !== -1;
};

//check user input for a negative response
let isNegative = (response) => {
  let lowerCaseResponse = response.toLowerCase();
  let negativeResponses = ['n', 'no', '0'];
  return negativeResponses.indexOf(lowerCaseResponse) !== -1;
};

module.exports = {
  isPositive: isPositive,
  isNegative: isNegative
}
