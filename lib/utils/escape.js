'use strict';

var escapeStringRegexp = require('escape-string-regexp');

// Build a regexp from a string
function re(str) {
  return new RegExp(escapeStringRegexp(str), 'g');
}

/**
 * Escape a string using a map of replacements.
 * @param  {Map} replacements
 * @param  {String} text
 * @return {String}
 */
function escapeWith(replacements, text) {
  text = replacements.reduce(function (out, value, key) {
    return out.replace(re(key), value);
  }, text);

  return text;
}

/**
 * Unescape a string using a map of replacements.
 * @param  {Map} replacements
 * @param  {String} text
 * @return {String}
 */
function unescapeWith(replacements, text) {
  return escapeWith(replacements.flip(), text);
}
/**
 * Create random idea.
 * @param {Number} count
 */
function uuid(count) {
  //用来生成unique字符串
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  if (!count) return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();else {
    var r = '';
    while (count--) {
      r = r + s4();
    }
    return r;
  }
}
module.exports = {
  escapeWith: escapeWith,
  unescapeWith: unescapeWith,
  uuid: uuid
};