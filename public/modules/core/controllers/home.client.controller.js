'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		if($scope.authentication.user.roles[1] === 'admin')
			$scope.user = 'admin';
		else
			$scope.user = 'customer';
	}
]);