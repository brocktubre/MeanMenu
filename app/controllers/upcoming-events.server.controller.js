'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UpcomingEvent = mongoose.model('UpcomingEvent'),
	_ = require('lodash');

/**
 * Create a Upcoming event
 */
exports.create = function(req, res) {
	var upcomingEvent = new UpcomingEvent(req.body);
	upcomingEvent.user = req.user;

	upcomingEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(upcomingEvent);
		}
	});
};

/**
 * Show the current Upcoming event
 */
exports.read = function(req, res) {
	res.jsonp(req.upcomingEvent);
};

/**
 * Update a Upcoming event
 */
exports.update = function(req, res) {
	var upcomingEvent = req.upcomingEvent ;

	upcomingEvent = _.extend(upcomingEvent , req.body);

	upcomingEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(upcomingEvent);
		}
	});
};

/**
 * Delete an Upcoming event
 */
exports.delete = function(req, res) {
	var upcomingEvent = req.upcomingEvent ;

	upcomingEvent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(upcomingEvent);
		}
	});
};

/**
 * List of Upcoming events
 */
exports.list = function(req, res) { 
	UpcomingEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, upcomingEvents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(upcomingEvents);
		}
	});
};

/**
 * Upcoming event middleware
 */
exports.upcomingEventByID = function(req, res, next, id) { 
	UpcomingEvent.findById(id).populate('user', 'displayName').exec(function(err, upcomingEvent) {
		if (err) return next(err);
		if (! upcomingEvent) return next(new Error('Failed to load Upcoming event ' + id));
		req.upcomingEvent = upcomingEvent ;
		next();
	});
};

/**
 * Upcoming event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// This lets any admin user delete and update
	if (req.user.roles[1] !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	/*if (req.menuitem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
