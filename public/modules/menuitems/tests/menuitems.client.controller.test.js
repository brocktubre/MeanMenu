'use strict';

(function() {
	// Menuitems Controller Spec
	describe('Menuitems Controller Tests', function() {
		// Initialize global variables
		var MenuitemsController,
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

			// Initialize the Menuitems controller.
			MenuitemsController = $controller('MenuitemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Menuitem object fetched from XHR', inject(function(Menuitems) {
			// Create sample Menuitem using the Menuitems service
			var sampleMenuitem = new Menuitems({
				name: 'New Menuitem'
			});

			// Create a sample Menuitems array that includes the new Menuitem
			var sampleMenuitems = [sampleMenuitem];

			// Set GET response
			$httpBackend.expectGET('menuitems').respond(sampleMenuitems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.menuitems).toEqualData(sampleMenuitems);
		}));

		it('$scope.findOne() should create an array with one Menuitem object fetched from XHR using a menuitemId URL parameter', inject(function(Menuitems) {
			// Define a sample Menuitem object
			var sampleMenuitem = new Menuitems({
				name: 'New Menuitem'
			});

			// Set the URL parameter
			$stateParams.menuitemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/menuitems\/([0-9a-fA-F]{24})$/).respond(sampleMenuitem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.menuitem).toEqualData(sampleMenuitem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Menuitems) {
			// Create a sample Menuitem object
			var sampleMenuitemPostData = new Menuitems({
				name: 'New Menuitem'
			});

			// Create a sample Menuitem response
			var sampleMenuitemResponse = new Menuitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Menuitem'
			});

			// Fixture mock form input values
			scope.name = 'New Menuitem';

			// Set POST response
			$httpBackend.expectPOST('menuitems', sampleMenuitemPostData).respond(sampleMenuitemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Menuitem was created
			expect($location.path()).toBe('/menuitems/' + sampleMenuitemResponse._id);
		}));

		it('$scope.update() should update a valid Menuitem', inject(function(Menuitems) {
			// Define a sample Menuitem put data
			var sampleMenuitemPutData = new Menuitems({
				_id: '525cf20451979dea2c000001',
				name: 'New Menuitem'
			});

			// Mock Menuitem in scope
			scope.menuitem = sampleMenuitemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/menuitems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/menuitems/' + sampleMenuitemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid menuitemId and remove the Menuitem from the scope', inject(function(Menuitems) {
			// Create new Menuitem object
			var sampleMenuitem = new Menuitems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Menuitems array and include the Menuitem
			scope.menuitems = [sampleMenuitem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/menuitems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMenuitem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.menuitems.length).toBe(0);
		}));
	});
}());