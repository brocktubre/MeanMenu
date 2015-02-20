'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	_ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) {
	var order = new Order(req.body);
	order.user = req.user;

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {
	var order = req.order ;

	order = _.extend(order , req.body);

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
	var order = req.order ;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders
 */
exports.list = function(req, res) { 
	Order.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) { 
	Order.findById(id).populate('user', 'displayName').exec(function(err, order) {
		if (err) return next(err);
		if (! order) return next(new Error('Failed to load Order ' + id));
		req.order = order ;
		next();
	});
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// This lets any admin user update live order items
	if (req.user.roles[1] !== 'admin') {
		return res.status(403).send('User is not authorized');
	}
	next();
};
