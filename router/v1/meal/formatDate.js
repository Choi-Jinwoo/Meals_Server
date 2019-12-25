const colorConsole = require('../../../lib/console');

module.exports = (data) => {
  try {
    if (parseInt(data) < 10) {
      return `0${data}`;
    } else {
      return data;
    }
  } catch (err) {
    colorConsole.red('날짜를 포맷하는중 오류가 발생하였습니다\n' + err);
  }
}