'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Menuitem = mongoose.model('Menuitem'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, menuitem;

/**
 * Menuitem routes tests
 */
describe('Menuitem CRUD tests', function() {
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

		// Save a user to the test db and create new Menuitem
		user.save(function() {
			menuitem = {
				name: 'Menuitem Name'
			};

			done();
		});
	});

	it('should be able to save Menuitem instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menuitem
				agent.post('/menuitems')
					.send(menuitem)
					.expect(200)
					.end(function(menuitemSaveErr, menuitemSaveRes) {
						// Handle Menuitem save error
						if (menuitemSaveErr) done(menuitemSaveErr);

						// Get a list of Menuitems
						agent.get('/menuitems')
							.end(function(menuitemsGetErr, menuitemsGetRes) {
								// Handle Menuitem save error
								if (menuitemsGetErr) done(menuitemsGetErr);

								// Get Menuitems list
								var menuitems = menuitemsGetRes.body;

								// Set assertions
								(menuitems[0].user._id).should.equal(userId);
								(menuitems[0].name).should.match('Menuitem Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Menuitem instance if not logged in', function(done) {
		agent.post('/menuitems')
			.send(menuitem)
			.expect(401)
			.end(function(menuitemSaveErr, menuitemSaveRes) {
				// Call the assertion callback
				done(menuitemSaveErr);
			});
	});

	it('should not be able to save Menuitem instance if no name is provided', function(done) {
		// Invalidate name field
		menuitem.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menuitem
				agent.post('/menuitems')
					.send(menuitem)
					.expect(400)
					.end(function(menuitemSaveErr, menuitemSaveRes) {
						// Set message assertion
						(menuitemSaveRes.body.message).should.match('Please fill Menuitem name');
						
						// Handle Menuitem save error
						done(menuitemSaveErr);
					});
			});
	});

	it('should be able to update Menuitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menuitem
				agent.post('/menuitems')
					.send(menuitem)
					.expect(200)
					.end(function(menuitemSaveErr, menuitemSaveRes) {
						// Handle Menuitem save error
						if (menuitemSaveErr) done(menuitemSaveErr);

						// Update Menuitem name
						menuitem.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Menuitem
						agent.put('/menuitems/' + menuitemSaveRes.body._id)
							.send(menuitem)
							.expect(200)
							.end(function(menuitemUpdateErr, menuitemUpdateRes) {
								// Handle Menuitem update error
								if (menuitemUpdateErr) done(menuitemUpdateErr);

								// Set assertions
								(menuitemUpdateRes.body._id).should.equal(menuitemSaveRes.body._id);
								(menuitemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Menuitems if not signed in', function(done) {
		// Create new Menuitem model instance
		var menuitemObj = new Menuitem(menuitem);

		// Save the Menuitem
		menuitemObj.save(function() {
			// Request Menuitems
			request(app).get('/menuitems')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Menuitem if not signed in', function(done) {
		// Create new Menuitem model instance
		var menuitemObj = new Menuitem(menuitem);

		// Save the Menuitem
		menuitemObj.save(function() {
			request(app).get('/menuitems/' + menuitemObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', menuitem.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Menuitem instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Menuitem
				agent.post('/menuitems')
					.send(menuitem)
					.expect(200)
					.end(function(menuitemSaveErr, menuitemSaveRes) {
						// Handle Menuitem save error
						if (menuitemSaveErr) done(menuitemSaveErr);

						// Delete existing Menuitem
						agent.delete('/menuitems/' + menuitemSaveRes.body._id)
							.send(menuitem)
							.expect(200)
							.end(function(menuitemDeleteErr, menuitemDeleteRes) {
								// Handle Menuitem error error
								if (menuitemDeleteErr) done(menuitemDeleteErr);

								// Set assertions
								(menuitemDeleteRes.body._id).should.equal(menuitemSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Menuitem instance if not signed in', function(done) {
		// Set Menuitem user 
		menuitem.user = user;

		// Create new Menuitem model instance
		var menuitemObj = new Menuitem(menuitem);

		// Save the Menuitem
		menuitemObj.save(function() {
			// Try deleting Menuitem
			request(app).delete('/menuitems/' + menuitemObj._id)
			.expect(401)
			.end(function(menuitemDeleteErr, menuitemDeleteRes) {
				// Set message assertion
				(menuitemDeleteRes.body.message).should.match('User is not logged in');

				// Handle Menuitem error error
				done(menuitemDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Menuitem.remove().exec();
		done();
	});
});