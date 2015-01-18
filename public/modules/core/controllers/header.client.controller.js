'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.navbaritems = [
		{title:'Home', uiRoute:'/#!/', link:'/#!/'},
		{title:'Menu', uiRoute:'/menu', link:'menuitems'},
		{title:'Upcoming Events', uiRoute:'/events', link:'events'},
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

		$scope.cartitems = 0;

		
		if(window.innerWidth > 800)
			$scope.pull_right = 'pull-right';
	}
]);