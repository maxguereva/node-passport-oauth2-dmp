var util = require('util')
	, OAuth2Strategy = require('passport-oauth2')
	, InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
 	options                  = options || {};
 	options.authorizationURL = options.authorizationURL || 'http://192.168.33.10:3000/v1/oauth/auth';
 	options.tokenURL         = options.tokenURL || 'http://192.168.33.10:3000/v1/oauth/token';
 	options.scopeSeparator   = options.scopeSeparator || ',';
 	options.customHeaders    = options.customHeaders || {};

 	OAuth2Strategy.call(this, options, verify);
 	this.name = 'Ysance';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from .
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `ysance`
 *   - `id`               the user's Ysance ID
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

 	this._oauth2.get('http://192.168.33.10:3000/v1/users/55e462bf27a003da14faba67', accessToken, function (err, body, res) {
	    if (err) {
	      	return done(new InternalOAuthError('failed to fetch user profile', err));
	    }

	    try {
	      	var json = JSON.parse(body);
	    } catch (ex) {
	      	return done(new Error("Failed to parse user profile"));
	    }

	    var profile         = {};
	    profile.provider    = 'ysance',
	    profile.id          = json.id,
	    profile.emails      = [{ value: json.email }];
	   
	    profile._raw  = body;
	    profile._json = json;

	    done(null, profile);
  	});
}

module.exports = Strategy;