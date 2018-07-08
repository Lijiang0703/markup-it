const BLOCKS = require('./blocks');
const INLINES = require('./inlines');

const VOID = {
    [BLOCKS.HR]:     true,
    [INLINES.IMAGE]: true,
    [BLOCKS.ADV_TABLE]: true,
    [BLOCKS.VIDEO]: true,
    [BLOCKS.TOC]: true
};

module.exports = VOID;
