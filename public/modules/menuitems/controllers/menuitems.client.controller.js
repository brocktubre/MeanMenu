'use strict';

// Menuitems controller
angular.module('menuitems').controller('MenuitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Menuitems',
	function($scope, $stateParams, $location, Authentication, Menuitems) {
		$scope.authentication = Authentication;

		$scope.showCategory = function(category){
			alert(category);
		};


		// Create new Menuitem
		$scope.create = function() {
			// Create new Menuitem object
			var menuitem = new Menuitems ({
				category: $scope.category,
				name: this.name,
				price: $scope.price,
				description: this.description
			});

			// Redirect after save
			menuitem.$save(function(response) {
				$location.path('menuitems/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Menuitem
		$scope.remove = function(menuitem) {
			if ( menuitem ) { 
				menuitem.$remove();

				for (var i in $scope.menuitems) {
					if ($scope.menuitems [i] === menuitem) {
						$scope.menuitems.splice(i, 1);
					}
				}
			} else {
				$scope.menuitem.$remove(function() {
					$location.path('menuitems');
				});
			}
		};

		// Update existing Menuitem
		$scope.update = function() {
			var menuitem = $scope.menuitem;

			menuitem.$update(function() {
				$location.path('menuitems/' + menuitem._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Menuitems
		$scope.find = function() {
			$scope.menuitems = Menuitems.query();
		};

		// finds the categories of food
		$scope.findCategories = function() {
			$scope.menuitems = Menuitems.query();
			
		};

		// Find existing Menuitem
		$scope.findOne = function() {
			$scope.menuitem = Menuitems.get({ 
				menuitemId: $stateParams.menuitemId
			});
		};
	}
]);