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

module.exports = [
// All link definition (for link reference) must be resolved first.
definition,
// HTML must be high in the stack too.
html, table, hr, list, footnote, blockquote, codeBlock, heading, math, comment, custom, divBlock, video, adv_table, paragraph, unstyled];