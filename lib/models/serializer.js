'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var typeOf = require('type-of');
var uid = require('uid');

var _require = require('slate'),
    Text = _require.Text,
    Mark = _require.Mark;

var RuleFunction = require('./rule-function');

var Serializer = function (_RuleFunction) {
    _inherits(Serializer, _RuleFunction);

    function Serializer() {
        _classCallCheck(this, Serializer);

        return _possibleConstructorReturn(this, (Serializer.__proto__ || Object.getPrototypeOf(Serializer)).apply(this, arguments));
    }

    _createClass(Serializer, [{
        key: 'matchType',


        /**
         * Limit execution of the serializer to a set of node types
         * @param {Function || Array || String} matcher
         * @return {Serializer}
         */
        value: function matchType(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.filter(function (state) {
                var node = state.peek();
                var type = node.type;

                return matcher(type);
            });
        }

        /**
         * Limit execution of the serializer to a kind of node
         * @param {Function || Array || String} matcher
         * @return {Serializer}
         */

    }, {
        key: 'matchKind',
        value: function matchKind(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.filter(function (state) {
                var node = state.peek();
                var kind = node.kind;

                return matcher(kind);
            });
        }

        /**
         * Limit execution of the serializer to range containing a certain mark
         * @param {Function || Array || String} matcher
         * @param {Function} transform(State, String, Mark)
         * @return {Serializer}
         */

    }, {
        key: 'matchMark',
        value: function matchMark(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.matchKind('text').filter(function (state) {
                var text = state.peek();

                return text.characters.some(function (char) {
                    var hasMark = char.marks.some(function (mark) {
                        return matcher(mark.type);
                    });
                    return hasMark;
                });
            });
        }

        /**
         * Transform all ranges in a text.
         * @param {Function} transform(state: State, range: Range)
         * @return {Serializer}
         */

    }, {
        key: 'transformRanges',
        value: function transformRanges(transform) {
            return this.matchKind('text').then(function (state) {
                var text = state.peek();
                var ranges = text.getLeaves();

                // Transform ranges
                ranges = ranges.map(function (range) {
                    return transform(state, range);
                });

                // Create new text and push it back
                var newText = Text.create({ leaves: ranges });
                return state.shift().unshift(newText);
            });
        }

        /**
         * Transform ranges matching a mark
         * @param {Function || Array || String} matcher
         * @param {Function} transform(state: State, text: String, mark: Mark): String
         * @return {Serializer}
         */

    }, {
        key: 'transformMarkedRange',
        value: function transformMarkedRange(matcher, transform) {
            matcher = normalizeMatcher(matcher);

            return this.matchMark(matcher).transformRanges(function (state, range) {
                var _range = range,
                    text = _range.text,
                    marks = _range.marks;

                var mark = range.marks.find(function (_ref) {
                    var type = _ref.type;
                    return matcher(type);
                });
                if (!mark) {
                    return range;
                }

                text = transform(state, text, mark);
                marks = marks.delete(mark);
                range = range.merge({ text: text, marks: marks });

                return range;
            });
        }

        /**
         * Transform text.
         * @param {Function} transform(state: State, range: Range): Range
         * @return {Serializer}
         */

    }, {
        key: 'transformText',
        value: function transformText(transform) {
            var MARK = uid();

            return this.matchKind('text')

            // We can't process empty text node
            .filter(function (state) {
                var text = state.peek();
                return !text.isEmpty;
            })

            // Avoid infinite loop
            .filterNot(new Serializer().matchMark(MARK))

            // Escape all text
            .transformRanges(function (state, range) {
                range = transform(state, range);

                return range.merge({
                    marks: range.marks.add(Mark.create({ type: MARK }))
                });
            });
        }
    }]);

    return Serializer;
}(RuleFunction);

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function || Array || String} matchIn
 * @return {Function}
 */

function normalizeMatcher(matcher) {
    switch (typeOf(matcher)) {
        case 'function':
            return matcher;
        case 'array':
            return function (type) {
                return matcher.includes(type);
            };
        case 'string':
            return function (type) {
                return type == matcher;
            };
    }
}

module.exports = function () {
    return new Serializer();
};