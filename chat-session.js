"use strict";
var store = {
    users: [],
	messages: [],
    count: 0,
    channels: {
        '#general': {
            type: 'user',
            messages: []
        },
        '#videogames': {
            type: 'user',
            messages: []
        },
        '#programming': {
            type: 'user',
            messages: []
        },
    }
};
exports.default = store;