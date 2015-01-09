'use strict';

//Menuitems service used to communicate Menuitems REST endpoints
angular.module('menuitems').factory('Menuitems', ['$resource',
	function($resource) {
		return $resource('menuitems/:menuitemId', { menuitemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);