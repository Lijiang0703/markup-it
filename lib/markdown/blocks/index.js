'use strict';

var hr = require('./hr');
var heading = require('./heading');
var paragraph = require('./paragraph');
var codeBlock = require('./code');
var blockquote = require('./blockquote');
var unstyled = require('./unstyled');
var footnote = require('./footnote');
var table = require('./table');
var list = require('./list');
var definition = require('./definition');
var math = require('./math');
var comment = require('./comment');
var html = require('./html');
var custom = require('./custom');
var video = require('./video');

module.exports = [html, definition, table, hr, list, footnote, blockquote, codeBlock, heading, math, comment, custom, paragraph, unstyled, video];