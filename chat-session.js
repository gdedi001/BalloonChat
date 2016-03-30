"use strict";
var store = {
    users: new Array(),
    count: 0,
    channels: {
        '#anouncements': {
            type: 'user',
            messages: new Array()
        },
        '#soccer': {
            type: 'user',
            messages: new Array()
        },
        '#jazz': {
            type: 'user',
            messages: new Array()
        },
    }
};
exports.default = store;