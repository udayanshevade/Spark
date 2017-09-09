const jwt = require('jsonwebtoken')
const config = require('./config');

/**
 * @description Generates user session token for authentication
 * @param {string} userId - session token built using username
 */
const generateSessionToken = (userId, expiresIn = 3600) => jwt.sign({ userId }, config.JWT_SECRET);

/**
 * @description Breaks down token to ensure session is authenticated
 * @param {sessionToken}
 * @param {string} dbUserId - to verify if sessionToken matches the pertinent user id
 */
function verifySessionToken (sessionToken, dbUserId) {
  return new Promise((res, reject) => {
    jwt.verify(sessionToken, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        // reject with invalid authentication status code
        reject(401);
      } else {
        res(decoded);
      }
    });
  });
}

/**
 * @description Curried function that returns error handler
 * @param {func} res - sends response to client
 * @param {object} errors - contains relevant errors for current request
 */
const handleErrorFn = (res, errors) => (statusCode) => {
  const status = typeof statusCode === 'number' ? statusCode : 500;
  const error = errors[status];
  console.log(statusCode);
  console.log(error);
  res.status(status).send({ error });
};

module.exports = {
  generateSessionToken,
  verifySessionToken,
  handleErrorFn,
};
