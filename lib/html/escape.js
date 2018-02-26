'use strict';

var entities = require('html-entities');
var htmlEntities = new entities.AllHtmlEntities();

/**
 * Escape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
  return htmlEntities.encode(str);
}

module.exports = escape;