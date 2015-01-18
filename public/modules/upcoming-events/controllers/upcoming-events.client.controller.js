'use strict';

// Upcoming events controller
angular.module('upcoming-events').controller('UpcomingEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'UpcomingEvents',
	function($scope, $stateParams, $location, Authentication, UpcomingEvents) {
		$scope.authentication = Authentication;

		// defines the current user premission
		if($scope.authentication.user.roles === undefined)
			$scope.user = 'new-customer';
		else if($scope.authentication.user.roles[1] === 'admin')
			$scope.user = 'admin';
		else if($scope.authentication.user.roles[0] === 'user')
			$scope.user = 'customer';

		// Create new Upcoming event
		$scope.create = function() {
			// Create new Upcoming event object
			var upcomingEvent = new UpcomingEvents ({
				name: toTitleCase(this.name),
				date: this.date,
				startTime: this.startTime,
				endTime: this.endTime,
				cover: this.cover,
				details: this.details
			});

			// Redirect after save
			upcomingEvent.$save(function(response) {
				$location.path('upcoming-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Upcoming event
		$scope.remove = function(upcomingEvent) {
			if ( upcomingEvent ) { 
				upcomingEvent.$remove();

				for (var i in $scope.upcomingEvents) {
					if ($scope.upcomingEvents [i] === upcomingEvent) {
						$scope.upcomingEvents.splice(i, 1);
					}
				}
			} else {
				$scope.upcomingEvent.$remove(function() {
					$location.path('upcoming-events');
				});
			}
		};

		// Update existing Upcoming event
		$scope.update = function() {
			var upcomingEvent = $scope.upcomingEvent;

			upcomingEvent.$update(function() {
				$location.path('upcoming-events/' + upcomingEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Upcoming events
		$scope.find = function() {
			$scope.upcomingEvents = UpcomingEvents.query();
		};

		// Find existing Upcoming event
		$scope.findOne = function() {
			$scope.upcomingEvent = UpcomingEvents.get({ 
				upcomingEventId: $stateParams.upcomingEventId
			});
		};

		// used for navigation bar
		if(window.innerWidth > 800)
			$scope.pull_right = 'pull-right';

		// This function filters out events that have already passed
		$scope.futureEvents = function(events){
			var now = new Date();
			var currEvent = new Date(events.date);

			if(currEvent >= now)
				return true;
			else 
				return false; 
		};

 		// Converts the text the title case and adds s on the end, example: burger -> Burgers
 		var toTitleCase = function(str){
 			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
 		};

 		// creates a list for the drop down time menu
 		$scope.timeList = [];
 		for (var i = 1; i <= 12; i++) {
 			$scope.timeList.push(i + ':00pm');
 			$scope.timeList.push(i + ':30pm');
 		}

 	}
 	]);