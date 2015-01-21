'use strict';

angular.module('core').controller('ContactController', ['$scope',
	function($scope){

		$scope.hasSent = false;
		
		$scope.sendMail = function(){

			var message = 'Someone want to know more about \n\n';
			message += 'Name: ' + $scope.name + '\n';
			message += 'Email: ' + $scope.email + '\n';
			message += 'Phone: ' + $scope.phone + '\n';
			message += 'Subject: ' + $scope.subject + '\n';
			message += 'Message: ' + $scope.message + '\n';

			var mailOptions = {
				from: 'sundowntavern@email.com',
				to: 'btubre9090@yahoo.com',
				subject: 'Contact Page [New Inquiry]',
				text: message
			};

			$scope.hasSent = true;

			setTimeout(
				function(){
					window.location.reload();
				}, 5000);
		};
	}
]);