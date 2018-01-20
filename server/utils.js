const jwt = require('jsonwebtoken')
const config = require('../config');

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
  if (!sessionToken) return false;
  try {
    const decoded = jwt.verify(sessionToken, config.JWT_SECRET);
    return decoded.userId === dbUserId;
  } catch (e) {
    console.error(e);
    return false;
  }
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
  const sorted = unsorted.sort((
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
  const now = Date.now();
  const sorted = unsorted.sort((
    { id: aId, created: aCreated, votes: { upVote: aUpVote, downVote: aDownVote }},
    { id: bId, created: bCreated, votes: { upVote: bUpVote, downVote: bDownVote }}
  ) => {
    const aAllVotes = aUpVote + aDownVote;
    const bAllVotes = bUpVote + bDownVote;
    const aLapsed = (now - new Date(aCreated)) / milsToHours;
    const bLapsed = (now - new Date(bCreated)) / milsToHours;
    const aWeightedScore = getConfidenceWeight(aUpVote, aAllVotes) + (1 / Math.pow(aLapsed + 2, timeFactor));
    const bWeightedScore = getConfidenceWeight(bUpVote, bAllVotes) + (1 / Math.pow(bLapsed + 2, timeFactor));
    return bWeightedScore - aWeightedScore;
  });
  return sorted;
}

/**
 * @description Get sorted post items
 */
function getSortedList (list, criterion) {
  let sorted;
  switch (criterion) {
    case 'score': {
      sorted = list.sort((a, b) => {
        const aVoteScore = a.votes.upVote - a.votes.downVote;
        const bVoteScore = b.votes.upVote - b.votes.downVote;
        return bVoteScore - aVoteScore;
      });
      break;
    }
    case 'new': {
      sorted = list.sort((a, b) => {
        if (a.created < b.created) {
          return 1;
        } else if (a.created > b.created) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    }
    case 'best': {
      sorted = getWeightedSort(list);
      break;
    }
    case 'hot': {
      sorted = getHotSort(list);
      break;
    }
    default: {
      sorted = list;
    }
  }
  return sorted;
}

/**
 * @description Get limited post items
 */
function getRestrictedList (list, direction, offset, limit) {
  const orderedList = direction === 'desc'
    ? list : [...list].reverse();
  return orderedList.slice(offset, offset + limit);
}

module.exports = {
  generateSessionToken,
  verifySessionToken,
  handleErrorFn,
  getWeightedSort,
  getHotSort,
  getSortedList,
  getRestrictedList,
};
