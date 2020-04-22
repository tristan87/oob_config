/*jshint esversion: 8 */

//create a filename based on the current date and time
module.exports = (ext) => {
  let date =    new Date();
  let year =    date.getFullYear();
  let month =   date.getMonth().toString().padStart(2, '0');
  let day =     date.getDay().toString().padStart(2, '0');
  let hour =    date.getHours().toString().padStart(2, '0');
  let minute =  date.getMinutes().toString().padStart(2, '0');
  let second =  date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}_${hour}-${minute}-${second}.${ext}`;
};
