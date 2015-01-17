'use strict';

// Menuitems controller
angular.module('menuitems')
	.service('cartService', function () {
        return {
            notes:function () {
            },
            addItem:function (menuitem) {
            },
            deleteItem:function (id) {
            }
        };
    })
	.controller('MenuitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Menuitems',
		function($scope, $stateParams, $location, Authentication, Menuitems) {
			$scope.authentication = Authentication;

				if($scope.authentication.user.roles[1] === 'admin')
					$scope.user = 'admin';
				else
					$scope.user = 'customer';



			$scope.showCategory = function(category){
				alert(category);
			};

			// Create new Menuitem
			$scope.create = function() {
				// Create new Menuitem object
				var menuitem = new Menuitems ({
					category: toTitleCase($scope.category),
					name: toTitleCase(this.name),
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

			// used in the create menuitem page, clears out the input field for category
			$scope.clearCategory = function(){
				$scope.category = '';
				$scope.addNew = true;
			};

			// used in the view menu items, shows the selected category items of the menu
			$scope.showCategoryItems = function(category){
				$scope.categorySelected = category;
			};

			// grabs the currently selected menu category
			$scope.getCategory = function(){
				return $scope.categorySelected;
			};

			// adds menu item to cart
			$scope.addToCart = function(item){
				alert(item);
			};

			// Find existing Menuitem
			$scope.findOne = function() {
				$scope.menuitems = Menuitems.query();
				$scope.menuitem = Menuitems.get({ 
					menuitemId: $stateParams.menuitemId
				});
				
			};

			// Converts the text the title case and adds s on the end, example: burger -> Burgers
			var toTitleCase = function(str){
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			};

		}
]);