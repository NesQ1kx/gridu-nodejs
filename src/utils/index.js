function isDateValid(date) {
  const regexp = new RegExp(/[1-9][0-9]{3}-[0-1][0-9]-[0-9][1-9]/);
  return regexp.test(date);
}

module.exports = {
  isDateValid,
}