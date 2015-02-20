'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'ngCart', 'Orders',
	function($scope, $stateParams, $location, Authentication, ngCart, Orders) {
		$scope.authentication = Authentication;

		// defines the current user premission
			if($scope.authentication.user.roles === undefined)
				$scope.user = 'new-customer';
			else if($scope.authentication.user.roles[1] === 'admin')
				$scope.user = 'admin';
			else if($scope.authentication.user.roles[0] === 'user')
				$scope.user = 'customer';

		// sets tax rate and shipping for ngCart
		ngCart.setTax(7.5);
    	ngCart.setShipping(0.00);
    	$scope.cartLength = ngCart.getCart().items.length;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				items: ngCart.getItems(),
				customerinfo: this.user,
				status: 1
			});

			// Redirect after save
			order.$save(function(response) {
				alert('Thank you for your order!');
				$location.path('/');
				ngCart.empty();

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders/');
				});
			}
		};

		$scope.streamLine = function(order){

			order.status++;

			order.$update(function() {
				//$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.inView = function(prop, val){
    		return function(item){
      		if (item[prop] < val) return true;
    		};
		};

		$scope.trackOrder = function(currStatus){
			if(currStatus > 4)
				return true;
			else
				return false;

		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();

		};

		$scope.findLiveOrders = function() {
			$scope.orders = Orders.query();
			setTimeout(function(){
   			window.location.reload(1);
			}, 60000);

		};

		$scope.calculateTotal = function(order){
			var total = 0;
			for(var i = 0; i < order.items.length; i++){
				total += order.items[i]._price;
			}
			total += (0.075 * total);
			return total;
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};

	}
]);