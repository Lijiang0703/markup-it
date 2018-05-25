'use strict';

var hr = require('./hr');
var video = require('./video');
var heading = require('./heading');
var paragraph = require('./paragraph');
var codeBlock = require('./code');
var divBlock = require('./divBlock');
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
var adv_table = require('./advtable');
var custom_html = require('./customhtml');

module.exports = [html, definition, table, divBlock, video, adv_table, custom_html, hr, list, footnote, blockquote, codeBlock, heading, math, comment, custom, paragraph, unstyled];