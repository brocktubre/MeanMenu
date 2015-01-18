'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MenuitemSchema = require('../../app/models/menuitem.server.model.js');
var CustomerInfoSchema = require('../../app/models/customerinfo.server.model.js');

/**
 * Menuitem Schema
 */
var OrderSchema = new Schema({
	userid: String,
	items: [MenuitemSchema],
	info: [CustomerInfoSchema],
	status: { type: String, default: 'Pending' },
	timestamp: { type: Date, default: Date.now }
});

mongoose.model('Order', OrderSchema);