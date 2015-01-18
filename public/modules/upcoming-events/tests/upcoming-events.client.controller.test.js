'use strict';

(function() {
	// Upcoming events Controller Spec
	describe('Upcoming events Controller Tests', function() {
		// Initialize global variables
		var UpcomingEventsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Upcoming events controller.
			UpcomingEventsController = $controller('UpcomingEventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Upcoming event object fetched from XHR', inject(function(UpcomingEvents) {
			// Create sample Upcoming event using the Upcoming events service
			var sampleUpcomingEvent = new UpcomingEvents({
				name: 'New Upcoming event'
			});

			// Create a sample Upcoming events array that includes the new Upcoming event
			var sampleUpcomingEvents = [sampleUpcomingEvent];

			// Set GET response
			$httpBackend.expectGET('upcoming-events').respond(sampleUpcomingEvents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.upcomingEvents).toEqualData(sampleUpcomingEvents);
		}));

		it('$scope.findOne() should create an array with one Upcoming event object fetched from XHR using a upcomingEventId URL parameter', inject(function(UpcomingEvents) {
			// Define a sample Upcoming event object
			var sampleUpcomingEvent = new UpcomingEvents({
				name: 'New Upcoming event'
			});

			// Set the URL parameter
			$stateParams.upcomingEventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/upcoming-events\/([0-9a-fA-F]{24})$/).respond(sampleUpcomingEvent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.upcomingEvent).toEqualData(sampleUpcomingEvent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UpcomingEvents) {
			// Create a sample Upcoming event object
			var sampleUpcomingEventPostData = new UpcomingEvents({
				name: 'New Upcoming event'
			});

			// Create a sample Upcoming event response
			var sampleUpcomingEventResponse = new UpcomingEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Upcoming event'
			});

			// Fixture mock form input values
			scope.name = 'New Upcoming event';

			// Set POST response
			$httpBackend.expectPOST('upcoming-events', sampleUpcomingEventPostData).respond(sampleUpcomingEventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Upcoming event was created
			expect($location.path()).toBe('/upcoming-events/' + sampleUpcomingEventResponse._id);
		}));

		it('$scope.update() should update a valid Upcoming event', inject(function(UpcomingEvents) {
			// Define a sample Upcoming event put data
			var sampleUpcomingEventPutData = new UpcomingEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Upcoming event'
			});

			// Mock Upcoming event in scope
			scope.upcomingEvent = sampleUpcomingEventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/upcoming-events\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/upcoming-events/' + sampleUpcomingEventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid upcomingEventId and remove the Upcoming event from the scope', inject(function(UpcomingEvents) {
			// Create new Upcoming event object
			var sampleUpcomingEvent = new UpcomingEvents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Upcoming events array and include the Upcoming event
			scope.upcomingEvents = [sampleUpcomingEvent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/upcoming-events\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUpcomingEvent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.upcomingEvents.length).toBe(0);
		}));
	});
}());