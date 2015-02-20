'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('statusorders', {
			url: '/orders/status',
			templateUrl: 'modules/orders/views/status-orders.client.view.html'
		}).
		state('pastorders', {
			url: '/orders/pastorders',
			templateUrl: 'modules/orders/views/past-orders.client.view.html'
		}).
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('createOrder', {
			url: '/orders/cart',
			templateUrl: 'modules/orders/views/cart-order.client.view.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		});
	}
]);