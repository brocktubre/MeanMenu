'use strict';

// Menuitems controller
angular.module('menuitems').controller('MenuitemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Menuitems', 'ngCart',
	function($scope, $stateParams, $location, Authentication, Menuitems, ngCart) {
		$scope.authentication = Authentication;

			// defines the current user premission
			if($scope.authentication.user.roles === undefined)
				$scope.user = 'new-customer';
			else if($scope.authentication.user.roles[1] === 'admin')
				$scope.user = 'admin';
			else if($scope.authentication.user.roles[0] === 'user')
				$scope.user = 'customer';

			$scope.dotw = '';

			// Create new Menuitem
			$scope.create = function() {

				var menuitem = new Menuitems();

				if($scope.dotw !== ''){


					$scope.category = 'Specials';
					// Create new Special Menuitem object
					menuitem = new Menuitems ({
						category: toTitleCase($scope.category),
						name: toTitleCase(this.name),
						price: $scope.price,
						description: this.description,
						dotw: $scope.dotw
					});
				}
				else{
					// Create new Menuitem object
					menuitem = new Menuitems ({
						category: toTitleCase($scope.category),
						name: toTitleCase(this.name),
						price: $scope.price,
						description: this.description
					});
				}

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


			$scope.getTodaysSpecial = function(menuitem){
				var d = new Date();
				var n = d.getDay();
				if(menuitem.dotw === n)
					return true;
				else
					return false;
			};

			// grabs today's date
			$scope.getToday = function(){
				var d = new Date();
				var n = d.getDay();
				return n;
			};

			// finds the day of hte week the special is associated with
			$scope.whatDay = function(dotw_value){
				var day = '';

				switch(dotw_value){
					case 1: 
						day = 'Monday';
						break;
					case 2: 
						day = 'Tuesday';
						break;
					case 3: 
						day =  'Wednesday';
						break;
					case 4: 
						day =  'Thursday';
						break;
					case 5: 
						day =  'Friday';
						break;
					case 6: 
						day =  'Saturday';
						break;
					case 7: 
						day =  'Sunday';
						break;
					default:
						break;	
					}

					return(day);

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

			// Add to cart functionality from ngCart
			ngCart.setTax(7.5);
    		ngCart.setShipping(0.00);

}]);