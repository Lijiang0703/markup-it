'use strict';

var trimTrailingLines = require('trim-trailing-lines');

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serialize = Serializer().matchType(BLOCKS.TAB_LIST).then(function (state) {
	var list = state.peek();
	var nodes = list.nodes;


	var output = nodes.map(function (item, index) {
		return serializeTabItems(state, item, index);
	}).join('');

	return state.shift().write(output);
	// return state.shift().write('#fhr');
});

function serializeTabItems(state, item, index) {
	var title = item.data.get('title');
	var body = state.use('block').serialize(item.nodes);

	body = '\n' + trimTrailingLines(body) + '\n';

	return '## ' + title + body;
	// return "# ge"
}

module.exports = { serialize: serialize };