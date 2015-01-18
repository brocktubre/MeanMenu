'use strict';

// Configuring the Articles module
angular.module('upcoming-events').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Upcoming Events', 'upcoming-events', 'dropdown', '/upcoming-events(/create)?');
		Menus.addSubMenuItem('topbar', 'upcoming-events', 'View Events', 'upcoming-events');
		Menus.addSubMenuItem('topbar', 'upcoming-events', 'Add New Event', 'upcoming-events/create');
	}
]);