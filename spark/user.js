const clone = require('clone');
const { generateSessionToken } = require('./utils');

const db = {
  "user": {
    sessionToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyIiwiaWF0IjoxNTA0ODMwMzM3fQ.3TV_r0Bngo1Mvl-zKtzb6gUJt9BKKVbbg7PXJa9QTBg',
    email: 'sample@email.com',
    password: 'password',
    subscriptions: ['react', 'redux', 'udacity'],
    profile: {
      id: 'user',
      created: 1468166872634,
      comments: ['894tuq4ut84ut8v4t8wun89g', '8tu4bsun805n8un48ve89'],
      posts: ['8xf0y6ziyjabvozdd253nd', '6ni6ok3ym7mf1p33lnez', 'llgj1kasd78f1ptk1nz1'],
      categories: [],
      votesGiven: {},
      commentsVotesReceived: {
        upVote: 6,
        downVote: -5,
      },
      postsVotesReceived: {
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
const newUserData = {
  comments: [],
  posts: [],
  categories: [],
  votesGiven: {},
  commentsVotesReceived: clone(newVotesReceived),
  postsVotesReceived: clone(newVotesReceived),
};

/**
 * @description Retrieve user profile data
 * @param {string} userId
 */
async function getProfile (client, userId) {
  try {
    const profile = { id: userId };
    const userQueryText = 'SELECT created FROM users WHERE user_id = $1';
    const userQueryVal = [userId];
    const { rows: queriedUsers } = await client.query(userQueryText, userQueryVal);
    const user = queriedUsers[0];
    if (!user) return { error: 403 };
    profile.created = user.created;
    const profileVotesText = `
      WITH post_votes AS (
        SELECT voter_id, target_id, vote FROM votes, posts
        WHERE votes.target_id = posts.post_id
        AND voter_id = $1
      ), comment_votes AS (
        SELECT voter_id, target_id, vote FROM votes, comments
        WHERE votes.target_id = comments.comment_id
        AND voter_id = $1
      ), all_votes AS (
        SELECT * FROM post_votes UNION SELECT * FROM comment_votes
      ) SELECT
        'postsVotesReceived' as type,
        sum(CASE WHEN vote = 'upVote' THEN 1 ELSE 0 END) as upVotes,
        sum(CASE WHEN vote = 'downVote' THEN 1 ELSE 0 END) as downVotes
      FROM post_votes
      UNION
      SELECT
        'commentsVotesReceived' as type,
        sum(CASE WHEN vote = 'upVote' THEN 1 ELSE 0 END) as upvotes,
        sum(CASE WHEN vote = 'downVote' THEN 1 ELSE 0 END) as downvotes
      FROM comment_votes;
    `;
    const { rows: votesRes } = await client.query(profileVotesText, userQueryVal);
    if (!votesRes || votesRes.length !== 2) return { error: 500 };
    votesRes.forEach((voteRes) => {
      profile[voteRes.type] = {
        upVote: +voteRes.upvotes,
        downVote: +voteRes.downvotes,
      };
    });
    profile.votesGiven = {};
    const votesGivenText = `SELECT target_id, vote FROM votes WHERE voter_id = $1`;
    const votesGivenVal = [userId];
    const { rows: votesGivenRes } = await client.query(votesGivenText, votesGivenVal);
    if (!votesRes) return { error: 500 };
    votesGivenRes.forEach(({ target_id: target, vote }) => {
      profile.votesGiven[target] = vote;
    });
    return profile;
  } catch (e) {
    console.error(e);
    return { error: 500 };
  }
}

/**
 * @description User login
 * @param {string} userId
 * @param {string} password
 * @returns {object} Access token, user profile details
 */
async function login (client, userId, password) {
  try {
    await client.query('BEGIN');
    // find user
    const loginText = 'SELECT session_token, password FROM users WHERE user_id = $1';
    const loginVals = [userId];
    const userDetails = await client.query(loginText, loginVals);
    const { rows: users } = userDetails;
    const user = users[0];
    if (!user) return { error: 403.1 };
    const { password: dbPassword } = user;
    if (password !== dbPassword) return { error: 403.2 };
    // if password verifies
    const sessionToken = generateSessionToken(userId);
    const sessionTokenText = `UPDATE users SET session_token = $1 WHERE user_id = $2`;
    const sessionTokenVals = [sessionToken, userId];
    // write session token to db
    await client.query(sessionTokenText, sessionTokenVals);
    // get user data
    const profile = await getProfile(client, userId);
    const subscriptionsText = 'SELECT category FROM category_subscriptions WHERE user_id = $1';
    const subscriptionsVal = [userId];
    const { rows: subscriptionsRows } = await client.query(subscriptionsText, subscriptionsVal);
    if (!subscriptionsRows) return { error: 500 };
    const subscriptions = subscriptionsRows.map(s => s.category);
    await client.query('COMMIT');
    return { sessionToken, profile, subscriptions };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    return { error: 500 };
  } finally {
    client.release();
  }
}

/**
 * @description Create a new user
 * @param {string} userId
 * @param {object} newData - password (req), email (opt)
 */
async function create (client, id, newData) {
  try {
    await client.query('BEGIN');
    const userQueryText = `SELECT EXISTS(SELECT user_id FROM users WHERE user_id = $1) as exists`;
    const userQueryVal = [id];
    const { rows: users } = await client.query(userQueryText, userQueryVal);
    if (users[0].exists) return { error: 403 };
    const { password, email } = newData;
    const userCreateText = `INSERT INTO users VALUES($1, $2, $3${email ? ', $4' : ''})`;
    const sessionToken = generateSessionToken(id);
    const userCreateVals = [id, password, sessionToken];
    if (email) userCreateVals.push(email);
    const created = await client.query(userCreateText, userCreateVals);
    const createdUser = {
      sessionToken,
      profile: Object.assign(
        { created, id },
        clone(newUserData),
      ),
      subscriptions: [],
    };
    if (email) createdUser.email = email;
    await client.query('COMMIT');
    return createdUser;
  } catch (e) {
    client.query('ROLLBACK');
    console.error(e);
    return { error: 500 };
  } finally {
    client.release();
  }
}

/**
 * @description Add user vote
 * @param {string} voterId - user_id of voter
 * @param {string} target - post or comment
 * @param {string} option - vote
 */
async function vote (client, voterId, target, option) {
  let response;
  try {
    await client.query('BEGIN');
    let voteOpt = option;
    if (option === 'null') {
      voteOpt = null;
    }
    // vote upsert
    const recordVoteText = `INSERT INTO votes VALUES($1, $2, $3)
      ON CONFLICT (voter_id, target_id)
      DO UPDATE SET vote = $3`;
    const recordVoteVals = [voterId, target, voteOpt];
    await client.query(recordVoteText, recordVoteVals);
    await client.query('COMMIT');
    response = {};
  } catch (e) {
    client.query('ROLLBACK');
    console.error(e);
    response = { error: 500 };
  } finally {
    client.release();
    return response;
  }
}

module.exports = {
  getProfile,
  login,
  create,
  vote,
};
