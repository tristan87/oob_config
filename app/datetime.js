//return the current date and time as a string in yyyy mm dd hh mm ss format
module.exports = (ext = 'txt', separators = '-_-') => {
  //parse the separator parameter string
  let y =  separators.slice(0,1);
  let d =  separators.slice(1,2);
  let h =  separators.slice(2,3);

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

  return `${year}${y}${month}${y}${day}${d}${hour}${h}${minute}${h}${second}`;
};
