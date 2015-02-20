'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Order = mongoose.model('Order'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, order;

/**
 * Order routes tests
 */
describe('Order CRUD tests', function() {
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

		// Save a user to the test db and create new Order
		user.save(function() {
			order = {
				name: 'Order Name'
			};

			done();
		});
	});

	it('should be able to save Order instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);

						// Get a list of Orders
						agent.get('/orders')
							.end(function(ordersGetErr, ordersGetRes) {
								// Handle Order save error
								if (ordersGetErr) done(ordersGetErr);

								// Get Orders list
								var orders = ordersGetRes.body;

								// Set assertions
								(orders[0].user._id).should.equal(userId);
								(orders[0].name).should.match('Order Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Order instance if not logged in', function(done) {
		agent.post('/orders')
			.send(order)
			.expect(401)
			.end(function(orderSaveErr, orderSaveRes) {
				// Call the assertion callback
				done(orderSaveErr);
			});
	});

	it('should not be able to save Order instance if no name is provided', function(done) {
		// Invalidate name field
		order.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(400)
					.end(function(orderSaveErr, orderSaveRes) {
						// Set message assertion
						(orderSaveRes.body.message).should.match('Please fill Order name');
						
						// Handle Order save error
						done(orderSaveErr);
					});
			});
	});

	it('should be able to update Order instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);

						// Update Order name
						order.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Order
						agent.put('/orders/' + orderSaveRes.body._id)
							.send(order)
							.expect(200)
							.end(function(orderUpdateErr, orderUpdateRes) {
								// Handle Order update error
								if (orderUpdateErr) done(orderUpdateErr);

								// Set assertions
								(orderUpdateRes.body._id).should.equal(orderSaveRes.body._id);
								(orderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Orders if not signed in', function(done) {
		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			// Request Orders
			request(app).get('/orders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Order if not signed in', function(done) {
		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			request(app).get('/orders/' + orderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', order.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Order instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);

						// Delete existing Order
						agent.delete('/orders/' + orderSaveRes.body._id)
							.send(order)
							.expect(200)
							.end(function(orderDeleteErr, orderDeleteRes) {
								// Handle Order error error
								if (orderDeleteErr) done(orderDeleteErr);

								// Set assertions
								(orderDeleteRes.body._id).should.equal(orderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Order instance if not signed in', function(done) {
		// Set Order user 
		order.user = user;

		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			// Try deleting Order
			request(app).delete('/orders/' + orderObj._id)
			.expect(401)
			.end(function(orderDeleteErr, orderDeleteRes) {
				// Set message assertion
				(orderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Order error error
				done(orderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Order.remove().exec();
		done();
	});
});