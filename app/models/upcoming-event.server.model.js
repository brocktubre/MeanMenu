'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Upcoming event Schema
 */
var UpcomingEventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please input the event name.',
		trim: true
	},
	date: {
		type: Date,
		required: 'Please input the event date.'
	},
	startTime: {
		type: String, 
		default: ''
	},
	endTime: {
		type: String,
		default: ''
	},
	cover: {
		type: Number,
		default: 0
	},
	details: {
		type: String,
		default: ''
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

mongoose.model('UpcomingEvent', UpcomingEventSchema);