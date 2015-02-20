'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'ngCart',
	function($scope, Authentication, Menus, ngCart) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		// Defines menu for non admin users
		$scope.navbaritems = [
		{title:'Home', uiRoute:'/', link:'/#!/'},
		{title:'Menu', uiRoute:'/menuitems', link:'menuitems'},
		{title:'Upcoming Events', uiRoute:'/upcoming-events', link:'upcoming-events'},
		{title:'Contact', uiRoute:'/contact', link:'contact'}
		];


		// defines the current user premission
		if($scope.authentication.user.roles === undefined)
			$scope.user = 'new-customer';
		else if($scope.authentication.user.roles[1] === 'admin')
			$scope.user = 'admin';
		else if($scope.authentication.user.roles[0] === 'user')
			$scope.user = 'customer';

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		
		if(window.innerWidth > 800)
			$scope.pull_right = 'pull-right';

		ngCart.setTax(7.5);
    	ngCart.setShipping(0.00);
	}
]);