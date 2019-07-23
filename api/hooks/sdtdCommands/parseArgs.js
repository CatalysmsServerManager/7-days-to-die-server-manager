module.exports = function (argString) {
  const result = argString.match(/'[^']*'|"[^"]*"|\S+/g) || [];
  return result.map(i => i.split('"').join(''))
}
