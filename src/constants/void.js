const BLOCKS = require('./blocks');
const INLINES = require('./inlines');

const VOID = {
    [BLOCKS.HR]:     true,
    [INLINES.IMAGE]: true,
    [BLOCKS.ADV_TABLE]: true,
    [BLOCKS.VIDEO]: true
};

module.exports = VOID;