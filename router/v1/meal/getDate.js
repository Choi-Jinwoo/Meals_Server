const formatDate = require('./formatDate');

module.exports = () => {
  const yyyy = new Date().getFullYear();
  const mm = formatDate(new Date().getMonth() + 1);
  const dd = formatDate(new Date().getDate());

  return `${yyyy}${mm}${dd}`
}