'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MenuitemSchema = require('../../app/models/menuitem.server.model.js');
var CustomerInfoSchema = require('../../app/models/user.server.model.js');

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	items: [MenuitemSchema],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	status: { type: Number, default: 1 },
	timestamp: {
		type: Date,
		default: Date.now
	},
	total: { type: Number }
});

mongoose.model('Order', OrderSchema);