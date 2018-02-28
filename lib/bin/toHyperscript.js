#! /usr/bin/env node
'use strict';

/* eslint-disable no-console */

var _require = require('slate'),
    State = _require.State;

var hyperprint = require('slate-hyperprint').default;

var _require2 = require('./helper'),
    transform = _require2.transform;

transform(function (document) {
    var state = State.create({ document: document });
    console.log(hyperprint(state));
});