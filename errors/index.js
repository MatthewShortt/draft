const MoleculerErrors = require('moleculer').Errors;

class AuthenticationError extends MoleculerErrors.MoleculerError {
	constructor(message, data) {
		super(message || 'AUTHENTICATION_FAILED', 401, 'AUTHENTICATION_ERROR', data);
	}
}

class ConflictError extends MoleculerErrors.MoleculerError {
	constructor(message, data) {
		super(message || 'CONFLICT_ERROR', 409, 'CONFLICT_ERROR', data);
	}
}

module.exports  = {
	AuthenticationError,
	ConflictError
};
