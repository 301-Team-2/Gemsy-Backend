const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Middleware for user authentication
function verifyUser(request, response, next) {
  // Callback function for JWT verification
  function valid(err, user) {
    request.user = user;
    next();
  }

  try {
    // Extract the token from the authorization header
    const token = request.headers.authorization.split(' ')[1];
    // Verify the token using the getKey function
    jwt.verify(token, getKey, {}, valid);
  } catch (error) {
    next('Not Authorized');
  }
}

// Define a client for accessing Auth0 JSON Web Key Set (JWKS)
const client = jwksClient({
  jwksUri: process.env.JWKS_URI, // URL from your Auth0 app dashboard
});

// Callback function to fetch the key for JWT verification
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = verifyUser;
