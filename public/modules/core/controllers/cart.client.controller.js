'use strict';

angular.module('core').controller('MyCartController', ['$scope', 'ngCart',
	function($scope, ngCart) {
		
		ngCart.setTax(7.5);
    	ngCart.setShipping(0.00);

    	$scope.cartLength = ngCart.getCart().items.length;

    	$scope.addToOrder = function(){
    		var items = ngCart.getItems();
    		var orderPlaced = 'Order Placed: ';
    		for (var i = 0; i < $scope.cartLength; i++){
    			orderPlaced += items[i]._quantity + 'x';
    			orderPlaced += items[i]._name;
    			if(i !== $scope.cartLength - 1)
    				orderPlaced += ', ';
    		}
    		console.log(orderPlaced);
    	};
    
	}
]);