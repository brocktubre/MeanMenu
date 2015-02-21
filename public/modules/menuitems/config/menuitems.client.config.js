'use strict';

// Configuring the Articles module
angular.module('menuitems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', '/');
		Menus.addMenuItem('topbar', 'Menu', 'menuitems', 'dropdown', '/menuitems(/create)?');
		Menus.addSubMenuItem('topbar', 'menuitems', 'View Menu', 'menuitems');
		Menus.addSubMenuItem('topbar', 'menuitems', 'Add New Menu Item', 'menuitems/create');
		Menus.addSubMenuItem('topbar', 'menuitems', 'Add Special', 'menuitems/create-special');
	}
]);