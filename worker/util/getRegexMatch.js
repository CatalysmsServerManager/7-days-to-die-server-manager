/**
 * Simple utility function to get the first matching regex match in a string.
 * @param {RegExp} regex
 * @param {string} text
 * @returns
 */

function getRegexMatch(regex, text) {
  const match = regex.exec(text);
  return match ? match[1] : null;
}

module.exports = getRegexMatch;
