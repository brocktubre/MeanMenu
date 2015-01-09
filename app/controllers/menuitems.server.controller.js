'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Menuitem = mongoose.model('Menuitem'),
	_ = require('lodash');

/**
 * Create a Menuitem
 */
exports.create = function(req, res) {
	var menuitem = new Menuitem(req.body);
	menuitem.user = req.user;

	//alert(menuitem.user);

	menuitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * Show the current Menuitem
 */
exports.read = function(req, res) {
	res.jsonp(req.menuitem);
};

/**
 * Update a Menuitem
 */
exports.update = function(req, res) {
	var menuitem = req.menuitem ;

	menuitem = _.extend(menuitem , req.body);

	menuitem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * Delete an Menuitem
 */
exports.delete = function(req, res) {
	var menuitem = req.menuitem ;

	menuitem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitem);
		}
	});
};

/**
 * List of Menuitems
 */
exports.list = function(req, res) { 
	Menuitem.find().sort('-created').populate('user', 'displayName').exec(function(err, menuitems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(menuitems);
		}
	});
};

/**
 * Menuitem middleware
 */
exports.menuitemByID = function(req, res, next, id) { 
	Menuitem.findById(id).populate('user', 'displayName').exec(function(err, menuitem) {
		if (err) return next(err);
		if (! menuitem) return next(new Error('Failed to load Menuitem ' + id));
		req.menuitem = menuitem ;
		next();
	});
};

/**
 * Menuitem authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.menuitem.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
