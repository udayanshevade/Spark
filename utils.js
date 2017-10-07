const jwt = require('jsonwebtoken')
const config = require('./config');

const milsToHours = 3600000;
const timeFactor = 2;

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

/**
 * @description Function that returns confidence-weighted rating
 * @param {number} pos - positive upvotes
 * @param {number} n - total votes
 */
function getConfidenceWeight(pos, n) {
  const z = 1.96;
  const z2 = z * z;
  const phat = pos / n;
  return (
    (
      (phat + (z2 / (2 * n)))
      - (
          z * Math.sqrt(
                (
                  (phat * (1 - phat))
                  + (z2 / (4 * n))
                ) / n
              )
        )
    )
    / (1 + (z2 / n))
  );
}

/**
 * @description Returns weighted collection
 * @param {array} unsorted - raw array of items to sort
 */
function getWeightedSort (unsorted) {
  sorted = unsorted.sort((
    { votes: { upVote: aUpVote, downVote: aDownVote }},
    { votes: { upVote: bUpVote, downVote: bDownVote }}
  ) => {
    const aAllVotes = aUpVote + aDownVote;
    const bAllVotes = bUpVote + bDownVote;
    const aWeightedScore = getConfidenceWeight(aUpVote, aAllVotes);
    const bWeightedScore = getConfidenceWeight(bUpVote, bAllVotes);
    return bWeightedScore - aWeightedScore;
  });
  return sorted;
}

/**
 * @description Returns collection
 * @param {array} unsorted - raw array of items to sort
 */
function getHotSort (unsorted) {
  sorted = unsorted.sort((
    { id: aId, timestamp: aTimestamp, votes: { upVote: aUpVote, downVote: aDownVote }},
    { id: bId, timestamp: bTimestamp, votes: { upVote: bUpVote, downVote: bDownVote }}
  ) => {
    const aAllVotes = aUpVote + aDownVote;
    const bAllVotes = bUpVote + bDownVote;
    const now = Date.now();
    const aLapsed = (now - aTimestamp) / milsToHours;
    const bLapsed = (now - bTimestamp) / milsToHours;
    const aWeightedScore = getConfidenceWeight(aUpVote, aAllVotes) + (1 / Math.pow(aLapsed + 2, timeFactor));
    const bWeightedScore = getConfidenceWeight(bUpVote, bAllVotes) + (1 / Math.pow(bLapsed + 2, timeFactor));
    return bWeightedScore - aWeightedScore;
  });
  return sorted;
}

module.exports = {
  generateSessionToken,
  verifySessionToken,
  handleErrorFn,
  getWeightedSort,
  getHotSort,
};
