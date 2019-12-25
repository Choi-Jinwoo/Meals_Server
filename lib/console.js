const colors = require('colors');

const green = (content) => {
  console.log(colors.green(content));
}

const yellow = (content) => {
  console.log(colors.yellow(content));
}

const red = (content) => {
  console.log(colors.red(content));
}

module.exports = {
  green,
  yellow,
  red
}