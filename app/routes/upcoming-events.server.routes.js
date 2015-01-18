'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var upcomingEvents = require('../../app/controllers/upcoming-events.server.controller');

	// Upcoming events Routes
	app.route('/upcoming-events')
		.get(upcomingEvents.list)
		.post(users.requiresLogin, upcomingEvents.create);

	app.route('/upcoming-events/:upcomingEventId')
		.get(upcomingEvents.read)
		.put(users.requiresLogin, upcomingEvents.hasAuthorization, upcomingEvents.update)
		.delete(users.requiresLogin, upcomingEvents.hasAuthorization, upcomingEvents.delete);

	// Finish by binding the Upcoming event middleware
	app.param('upcomingEventId', upcomingEvents.upcomingEventByID);
};
