"use strict";
var store = {
    users: [],
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