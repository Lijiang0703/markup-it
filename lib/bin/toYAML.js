#! /usr/bin/env node
'use strict';

/* eslint-disable no-console */

var yaml = require('js-yaml');

var _require = require('slate'),
    Value = _require.Value;

var _require2 = require('./helper'),
    transform = _require2.transform;

transform(function (document) {
    var state = Value.create({ document: document });
    var raw = state.toJSON();

    console.log(yaml.safeDump(raw));
});