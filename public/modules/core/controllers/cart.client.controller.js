'use strict';

angular.module('core').controller('MyCartController', ['$scope', 'ngCart',
	function($scope, ngCart) {
		ngCart.setTax(7.5);
    	ngCart.setShipping(0.00);
    	console.log (ngCart.$cart.items);
    
	}
]);