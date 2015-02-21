'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Menuitem Schema
 */
var MenuitemSchema = new Schema({
	category: {
		type: String,
		default: '',
		required: 'Please select a category of the menu item.',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please input the menu item name.',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	price: {
		type: Number,
		default: '',
		required: 'Please input a price.',
		trim: true
	},
	dotw:{
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Menuitem', MenuitemSchema);