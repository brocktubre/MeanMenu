'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UpcomingEvent = mongoose.model('UpcomingEvent');

/**
 * Globals
 */
var user, upcomingEvent;

/**
 * Unit tests
 */
describe('Upcoming event Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			upcomingEvent = new UpcomingEvent({
				name: 'Upcoming event Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return upcomingEvent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			upcomingEvent.name = '';

			return upcomingEvent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UpcomingEvent.remove().exec();
		User.remove().exec();

		done();
	});
});