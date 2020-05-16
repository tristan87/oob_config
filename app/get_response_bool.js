//check user input for a positive response and return true if present
let isPositive = (response = '') => {
  let lowerCaseResponse = response.toLowerCase();
  let positiveResponses = ['y', 'ye', 'yes', '1'];
  return positiveResponses.indexOf(lowerCaseResponse) !== -1;
};

//check user input for a negative or empty response and return true if present
let isNegative = (response = '') => {
  let lowerCaseResponse = response.toLowerCase();
  let negativeResponses = ['n', 'no', '0', ''];
  return negativeResponses.indexOf(lowerCaseResponse) !== -1;
};

module.exports = {
  positive: isPositive,
  negative: isNegative
};
