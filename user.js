const clone = require('clone');
const { generateSessionToken, verifySessionToken } = require('./utils');

const db = {
  "user": {
    sessionToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyIiwiaWF0IjoxNTA0ODMwMzM3fQ.3TV_r0Bngo1Mvl-zKtzb6gUJt9BKKVbbg7PXJa9QTBg',
    email: 'sample@email.com',
    password: 'password',
    profile: {
      id: 'user',
      created: 1468166872634,
      comments: ['894tuq4ut84ut8v4t8wun89g', '8tu4bsun805n8un48ve89'],
      posts: ['8xf0y6ziyjabvozdd253nd', '6ni6ok3ym7mf1p33lnez'],
      categories: [],
      votesGiven: {},
      commentVotesReceived: {
        upVote: 6,
        downVote: -5,
      },
      postVotesReceived: {
        upVote: 21,
        downVote: -5,
      },
    },
  },
};

const newVotesReceived = {
  upVote: 0,
  downVote: 0,
};

// Default profile data object for a new user
const newUserProfileData = {
  comments: [],
  posts: [],
  categories: [],
  votesGiven: {},
  commentVotesReceived: clone(newVotesReceived),
  postVotesReceived: clone(newVotesReceived),
};

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

/**
 * @description Retrieve user profile data
 * @param {string} userId
 */
function getProfile (userId) {
  return new Promise((res, reject) => {
    const users = getData();
    const user = users[userId];
    if (!user) {
      reject(403);
    } else {
      const { profile } = users[userId];
      res(profile);
    }
  });
}

/**
 * @description Retrieve user posts
 * @param {string} userId
 * @returns {array} Post ids for the specified user
 */
function getPosts (userId) {
  return new Promise((res) => {
    const users = getData();
    const { profile } = users[userId];
    const { posts } = profile;
    res(posts);
  });
}

/**
 * @description Retrieve user comments
 * @param {string} userId
 * @returns {array} Comment ids for the specified user
 */
function getComments (userId) {
  return new Promise((res) => {
    const users = getData();
    const { profile } = users[userId];
    const { comments } = profile;
    res(comments);
  });
}

/**
 * @description Check if username available
 * @param {string} userId
 * @returns {string} string if available
 */
function checkUserExists (userId) {
  return new Promise((res, reject) => {
    const users = getData();
    if (users[userId]) {
      reject(403);
    } else {
      res({ success: 'Username is available.' });
    }
  });
}

/**
 * @description User login
 * @param {string} userId
 * @param {string} password
 * @returns {object} Access token, user profile details
 */
function login (userId, password) {
  return new Promise((res, reject) => {
    const users = getData();
    const user = users[userId];
    const { password: dbPassword, profile } = user;
    if (password === dbPassword) {
      const sessionToken = generateSessionToken(userId);
      users[userId].sessionToken = sessionToken;
      res({ sessionToken, profile });
    } else {
      reject('Incorrect password.', 403);
    }
  });
}

/**
 * @description Create a new user
 * @param {string} userId
 * @param {object} newData - password (req), email (opt)
 */
function create (userId, newData) {
  return new Promise((res, reject) => {
    const users = getData();
    if (users[userId]) {
      reject(403);
    } else {
      const { password, email } = newData;
      users[userId] = {
        profile: Object.assign(
          {
            userId,
            created: Date.now(),
          }, 
          clone(newUserProfileData),
        ),
      };
      users[userId].password = password;
      if (email) users[userId].email = email;
      const sessionToken = generateSessionToken(userId);
      users[userId].sessionToken = sessionToken;
      res(users[userId]);
    }
  });
}

/**
 * @description Update user meta data
 * @param {string} sessionToken - for user validation
 * @param {string} userId
 * @param {object} updatedData - password, email
 */
function update (sessionToken, userId, updatedData) {
  return new Promise((res, reject) => {
    const users = getData();
    const { sessionToken: dbSessionToken, userId: dbUserId } = users[userId];
    verifySessionToken(sessionToken, dbUserId)
      .then(data => {
        const { email, password, profile } = updatedData;
        if (password) users[userId].password = password;
        if (email) users[userId].email = email;
        res({});
      })
      .catch(err => reject(err));
  });
}

/**
 * @description Track post id reference
 * @param {string} userId
 * @param {string} postId
 */
function addPost (userId, postId) {
  const users = getData();
  const user = users[userId];
  user.profile.posts.push(postId);
}

/**
 * @description Remove post id reference
 * @param {string} userId
 * @param {string} postId
 */
function removePost (userId, postId) {
  const users = getData();
  const { profile } = users[userId];
  profile.posts.splice(profile.posts.indexOf(postId));
}


/**
 * @description Track comment id reference
 * @param {string} userId
 * @param {string} commentId
 */
function addComment (userId, commentId) {
  const users = getData();
  const user = users[userId];
  user.profile.comments.push(commentId);
}

/**
 * @description Remove comment id reference
 * @param {string} userId
 * @param {string} commentId
 */
function removeComment (userId, commentId) {
  const users = getData();
  const { profile } = users[userId];
  profile.comments.splice(profile.comments.indexOf(commentId));
}

/**
 * @description Update user Post score
 * @param {string} userId
 * @param {string} vote option, i.e. 'upVote'/'downVote'
 */
function updatePostScore (userId, option) {
  const users = getData();
  const user = users[userId];
  const delta = option === 'upVote' ? 1 : -1;
  user.profile.postVotesReceived[option] += delta;
}

/**
 * @description Update user Comment score
 * @param {string} userId
 * @param {string} vote option
 */
function updateCommentScore (userId, option) {
  const users = getData();
  const user = users[userId];
  const delta = option === 'upVote' ? 1 : -1;
  user.profile.commentVotesReceived[option] += delta;
}

/**
 * @description Initial vote for created post or comment
 */
function writeUserVote (userId, voteId, option = 'upVote') {
  const users = getData();
  const user = users[userId];
  user.profile.votesGiven[voteId] = option;
}

/**
 * @description Add post to user votes
 * @param {string} userId
 * @param {string} vote option
 */
function updateUserVote (sessionToken, userId, voteId, option) {
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, userId)
      .then((data) => {
        // overwrite old option if one existed
        writeUserVote(userId, voteId, option);
        // query old vote record
        const oldOption = user.profile.votesGiven[voteId];
        let newOption = option;
        if (oldOption === option) {
          newOption = null;
        } else if (oldOption && !option) {
          newOption = oldOption === 'upVote' ? 'downVote' : 'upVote';
        }
        res(newOption);
      }).catch(err => reject(err));
  });
}

module.exports = {
  getProfile,
  getPosts,
  getComments,
  checkUserExists,
  login,
  create,
  update,
  addPost,
  removePost,
  addComment,
  removeComment,
  updatePostScore,
  updateCommentScore,
  writeUserVote,
  updateUserVote,
};
