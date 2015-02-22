'use strict';

module.exports = {
	db: 'mongodb://localhost/meanmenu-v3-dev',
	app: {
		title: 'MeanMenu_v3 - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1374287992890868',
		clientSecret: process.env.FACEBOOK_SECRET || '872e49d9c7ed4e890fbb09b943d1d582',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'zFSY5vPiOE8J4stlyg7oWkYm0',
		clientSecret: process.env.TWITTER_SECRET || 'xPKGwGcfoxaCoUrs0mXotHojGzV7qAEHlmsyVF5lXdYtBplpov',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '221767823672-9a0bfbl9i2poglsfdk7ggc9vgp5pelmn.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'lVCH_qy4mOZxRMs5fX-YIkFq',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
