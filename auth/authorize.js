const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

function verifyUser(request, response, next) {
  function valid(err, user) {
    if (err) {
      return next(err);
    }
    request.user = user;
    next();
  }

  try {
    const token = request.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, valid);
  } catch (error) {
    next(error);
  }
}

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = verifyUser;
