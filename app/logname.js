/*jshint esversion: 8 */

//create a filename based on the current date and time
module.exports = (ext) => {
  let zeroPad = (timeObj) => {
    let timeStr = timeObj.toString();
    return timeStr.padStart(2, '0');
  };

  let date =    new Date();

  let year =    zeroPad(date.getFullYear());
  let month =   zeroPad(date.getMonth() + 1);
  let day =     zeroPad(date.getDate());
  let hour =    zeroPad(date.getHours());
  let minute =  zeroPad(date.getMinutes());
  let second =  zeroPad(date.getSeconds());
  return `${year}-${month}-${day}_${hour}-${minute}-${second}.${ext}`;
};
