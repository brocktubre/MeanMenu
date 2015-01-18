'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {

		if(window.innerWidth > 800){
			$scope.pull_right = 'pull-right';
			$scope.social_icon = 'padding-top: 50px;';
		}
	}
]);