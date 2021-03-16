"use strict";

const DbMixin = require("../mixins/db.mixin");
const crypto = require('crypto');
const {
	EmailAuthenticationError,
	EmailOrUsernameAuthenticationError,
	PasswordAuthenticationError,
	EmailConflictError,
	UsernameConflictError
} = require('../errors/users.errors');

module.exports = {
	name: "users",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("users")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"email",
			"username",
			"salt",
			"password",
		]
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Create user override
		 */
		create: {
			rest: "POST /",
			params: {
				email: 'email',
				username: 'string',
				password: 'string'
			},
			async handler(ctx) {
				const {email, username, password} = ctx.params;

				await this.throwErrorIfEmailExists(email);
				await this.throwErrorIfUsernameExists(username);

				const salt = this.generateSalt();
				const saltHashPassword = this.saltHashPassword(password, salt);

				const user = await this.adapter.insert({
					email,
					username,
					salt,
					password: saltHashPassword
				});

				const token = await this.generateJWT({ id: this.encodeID(user._id.toString()), ...user });
				return {
					token,
					username: user.username,
					email: user.email
				};
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		generateSalt(length) {
			return crypto.randomBytes(length || 64).toString('hex');
		},

		saltHashPassword(password, salt) {
			return crypto.createHmac('SHA512', salt)
				.update(password)
				.digest('hex');
		},

		async generateJWT(user) {
			return this.broker.call('security.sign', {user});
		},

		async throwErrorIfEmailExists(email) {
			let userByEmail = await this.adapter.findOne({email});
			if (userByEmail) throw new EmailConflictError();
		},

		async throwErrorIfUsernameExists(username) {
			let userByUsername = await this.adapter.findOne( {username});
			if (userByUsername) throw new UsernameConflictError();
		},

		// TODO: this will need to be moved to an email service
		sendResetPasswordLink(email) {
			return {email};
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
