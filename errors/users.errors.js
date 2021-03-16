const {AuthenticationError, ConflictError} = require('./');

class EmailAuthenticationError extends AuthenticationError {
	constructor(message) {
		super(message || 'EMAIL_DOES_NOT_EXIST');
	}
}

class EmailOrUsernameAuthenticationError extends AuthenticationError {
	constructor(message) {
		super(message || 'EMAIL_OR_USERNAME_DOES_NOT_EXIST');
	}
}

class PasswordAuthenticationError extends AuthenticationError {
	constructor(message) {
		super(message || 'INCORRECT_PASSWORD');
	}
}

class EmailConflictError extends ConflictError {
	constructor(message) {
		super(message || 'EMAIL_ALREADY_EXISTS');
	}
}

class UsernameConflictError extends ConflictError {
	constructor(message) {
		super(message || 'USERNAME_ALREADY_EXISTS');
	}
}

module.exports = {
	EmailAuthenticationError,
	EmailOrUsernameAuthenticationError,
	PasswordAuthenticationError,
	EmailConflictError,
	UsernameConflictError
};
