'use strict';

//Upcoming events service used to communicate Upcoming events REST endpoints
angular.module('upcoming-events').factory('UpcomingEvents', ['$resource',
	function($resource) {
		return $resource('upcoming-events/:upcomingEventId', { upcomingEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);