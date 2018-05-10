const hr = require('./hr');
const video = require('./video');
const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code');
const divBlock = require('./divBlock');
const blockquote = require('./blockquote');
const unstyled = require('./unstyled');
const footnote = require('./footnote');
const table = require('./table');
const list = require('./list');
const definition = require('./definition');
const math = require('./math');
const comment = require('./comment');
const html = require('./html');
const custom = require('./custom');
const adv_table = require('./advtable');

module.exports = [
    html,
    definition,
    table,
    hr,
    list,
    footnote,
    blockquote,
    codeBlock,
    heading,
    math,
    comment,
    custom,
    paragraph,
    unstyled,
    divBlock,
    video,
    adv_table
];
