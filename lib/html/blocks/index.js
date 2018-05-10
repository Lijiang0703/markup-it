'use strict';

var table = require('./table');

module.exports = [require('./paragraph'), require('./hr'), require('./blockquote'), require('./code'), require('./heading'), require('./list'), require('./listitem'), require('./unstyled'), table.table, table.row, table.cell, require('./footnote'), require('./html'), require('./advtable'), require('./divblock'), require('./video')];