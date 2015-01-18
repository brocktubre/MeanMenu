'use strict';

//Setting up route
angular.module('upcoming-events').config(['$stateProvider',
	function($stateProvider) {
		// Upcoming events state routing
		$stateProvider.
		state('listUpcomingEvents', {
			url: '/upcoming-events',
			templateUrl: 'modules/upcoming-events/views/list-upcoming-events.client.view.html'
		}).
		state('createUpcomingEvent', {
			url: '/upcoming-events/create',
			templateUrl: 'modules/upcoming-events/views/create-upcoming-event.client.view.html'
		}).
		state('viewUpcomingEvent', {
			url: '/upcoming-events/:upcomingEventId',
			templateUrl: 'modules/upcoming-events/views/view-upcoming-event.client.view.html'
		}).
		state('editUpcomingEvent', {
			url: '/upcoming-events/:upcomingEventId/edit',
			templateUrl: 'modules/upcoming-events/views/edit-upcoming-event.client.view.html'
		});
	}
]);