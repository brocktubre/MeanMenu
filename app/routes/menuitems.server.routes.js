'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var menuitems = require('../../app/controllers/menuitems.server.controller');

	// Menuitems Routes
	app.route('/menuitems')
		.get(menuitems.list)
		.post(users.requiresLogin, menuitems.create);

	app.route('/menuitems/:menuitemId')
		.get(menuitems.read, users.requiresLogin)
		.put(users.requiresLogin, menuitems.hasAuthorization, menuitems.update)
		.delete(users.requiresLogin, menuitems.hasAuthorization, menuitems.delete);

	// Finish by binding the Menuitem middleware
	app.param('menuitemId', menuitems.menuitemByID);
};
