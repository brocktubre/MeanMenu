'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UpcomingEvent = mongoose.model('UpcomingEvent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, upcomingEvent;

/**
 * Upcoming event routes tests
 */
describe('Upcoming event CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Upcoming event
		user.save(function() {
			upcomingEvent = {
				name: 'Upcoming event Name'
			};

			done();
		});
	});

	it('should be able to save Upcoming event instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Upcoming event
				agent.post('/upcoming-events')
					.send(upcomingEvent)
					.expect(200)
					.end(function(upcomingEventSaveErr, upcomingEventSaveRes) {
						// Handle Upcoming event save error
						if (upcomingEventSaveErr) done(upcomingEventSaveErr);

						// Get a list of Upcoming events
						agent.get('/upcoming-events')
							.end(function(upcomingEventsGetErr, upcomingEventsGetRes) {
								// Handle Upcoming event save error
								if (upcomingEventsGetErr) done(upcomingEventsGetErr);

								// Get Upcoming events list
								var upcomingEvents = upcomingEventsGetRes.body;

								// Set assertions
								(upcomingEvents[0].user._id).should.equal(userId);
								(upcomingEvents[0].name).should.match('Upcoming event Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Upcoming event instance if not logged in', function(done) {
		agent.post('/upcoming-events')
			.send(upcomingEvent)
			.expect(401)
			.end(function(upcomingEventSaveErr, upcomingEventSaveRes) {
				// Call the assertion callback
				done(upcomingEventSaveErr);
			});
	});

	it('should not be able to save Upcoming event instance if no name is provided', function(done) {
		// Invalidate name field
		upcomingEvent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Upcoming event
				agent.post('/upcoming-events')
					.send(upcomingEvent)
					.expect(400)
					.end(function(upcomingEventSaveErr, upcomingEventSaveRes) {
						// Set message assertion
						(upcomingEventSaveRes.body.message).should.match('Please fill Upcoming event name');
						
						// Handle Upcoming event save error
						done(upcomingEventSaveErr);
					});
			});
	});

	it('should be able to update Upcoming event instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Upcoming event
				agent.post('/upcoming-events')
					.send(upcomingEvent)
					.expect(200)
					.end(function(upcomingEventSaveErr, upcomingEventSaveRes) {
						// Handle Upcoming event save error
						if (upcomingEventSaveErr) done(upcomingEventSaveErr);

						// Update Upcoming event name
						upcomingEvent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Upcoming event
						agent.put('/upcoming-events/' + upcomingEventSaveRes.body._id)
							.send(upcomingEvent)
							.expect(200)
							.end(function(upcomingEventUpdateErr, upcomingEventUpdateRes) {
								// Handle Upcoming event update error
								if (upcomingEventUpdateErr) done(upcomingEventUpdateErr);

								// Set assertions
								(upcomingEventUpdateRes.body._id).should.equal(upcomingEventSaveRes.body._id);
								(upcomingEventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Upcoming events if not signed in', function(done) {
		// Create new Upcoming event model instance
		var upcomingEventObj = new UpcomingEvent(upcomingEvent);

		// Save the Upcoming event
		upcomingEventObj.save(function() {
			// Request Upcoming events
			request(app).get('/upcoming-events')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Upcoming event if not signed in', function(done) {
		// Create new Upcoming event model instance
		var upcomingEventObj = new UpcomingEvent(upcomingEvent);

		// Save the Upcoming event
		upcomingEventObj.save(function() {
			request(app).get('/upcoming-events/' + upcomingEventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', upcomingEvent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Upcoming event instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Upcoming event
				agent.post('/upcoming-events')
					.send(upcomingEvent)
					.expect(200)
					.end(function(upcomingEventSaveErr, upcomingEventSaveRes) {
						// Handle Upcoming event save error
						if (upcomingEventSaveErr) done(upcomingEventSaveErr);

						// Delete existing Upcoming event
						agent.delete('/upcoming-events/' + upcomingEventSaveRes.body._id)
							.send(upcomingEvent)
							.expect(200)
							.end(function(upcomingEventDeleteErr, upcomingEventDeleteRes) {
								// Handle Upcoming event error error
								if (upcomingEventDeleteErr) done(upcomingEventDeleteErr);

								// Set assertions
								(upcomingEventDeleteRes.body._id).should.equal(upcomingEventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Upcoming event instance if not signed in', function(done) {
		// Set Upcoming event user 
		upcomingEvent.user = user;

		// Create new Upcoming event model instance
		var upcomingEventObj = new UpcomingEvent(upcomingEvent);

		// Save the Upcoming event
		upcomingEventObj.save(function() {
			// Try deleting Upcoming event
			request(app).delete('/upcoming-events/' + upcomingEventObj._id)
			.expect(401)
			.end(function(upcomingEventDeleteErr, upcomingEventDeleteRes) {
				// Set message assertion
				(upcomingEventDeleteRes.body.message).should.match('User is not logged in');

				// Handle Upcoming event error error
				done(upcomingEventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		UpcomingEvent.remove().exec();
		done();
	});
});