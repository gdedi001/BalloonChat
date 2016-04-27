"use strict";
var store = {
    users: [],
    channels: {
        general: {
            type: 'user',
            messages: []
        },
        videogames: {
            type: 'user',
            messages: []
        },
        programming: {
            type: 'user',
            messages: []
        },
				other: {
					type: 'moderator',
					messages: []
				}
    }
};
exports.default = store;

//var express = require('express');
//var mongoose = require('mongoose');
//
////exports.api = express.Router();
//
//var userSchema = new mongoose.Schema({
//	user: String
//});
//
//var messageSchema = new mongoose.Schema({
//	msg: String
//});
//
//var storeSchema = new mongoose.Schema({
//    users: [userSchema],
//    channels: {
//        general: {
//            messages: [messageSchema]
//        },
//        videogames: {
//            messages: [messageSchema]
//        },
//        programming: {
//            messages: [messageSchema]
//        },
//				other: {
//					messages: [messageSchema]
//				}
//    }
//});
//
//var User = mongoose.model('User', userSchema);
//var Message = mongoose.model('Message', messageSchema);
//var Storage = mongoose.model('Storage', storeSchema);
//
//module.exports = {
//	User: User,
//	Message: Message,
//	Storage: Storage
//}