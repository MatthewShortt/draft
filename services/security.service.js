'use strict';
const JWT = require('jsonwebtoken');
const { AuthenticationError } = require('../errors');

module.exports = {
	name: 'security',

	actions: {
		authenticate: {
			params: {
				token: 'string'
			},
			async handler(ctx) {
				const { token } = ctx.params;
				try {
					return JWT.verify(token, this.PUBLIC_KEY);
				} catch (e) {
					throw new AuthenticationError();
				}
			}
		},

		sign: {
			params: {
				user: {
					type: 'object',
					props: {
						username: 'string'
					}
				}
			},
			async handler(ctx) {
				const { user } = ctx.params;
				const payload = {
					iss: 'draft',
					sub: user.username,
					scopes: ['general']
				};
				return JWT.sign(payload, this.PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '2h' });
			}
		}
	},

	methods: {
		parseKey(key) {
			return key.replace(/\\n/g, '\n');
		}
	},

	async started() {
		this.PUBLIC_KEY = this.parseKey(process.env.PUBLIC_KEY);
		this.PRIVATE_KEY = this.parseKey(process.env.PRIVATE_KEY);
	}
};
