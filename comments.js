const { verifySessionToken } = require('./utils');
const uuidv4 = require('uuid/v4');

const db = {
  "894tuq4ut84ut8v4t8wun89g": {
    id: '894tuq4ut84ut8v4t8wun89g',
    postId: "8xf0y6ziyjabvozdd253nd",
    parentId: null,
    ancestorId: null,
    children: ['8tu4bsun805n8un48ve89'],
    timestamp: 1468166872634,
    body: 'Hi there! I am a COMMENT.',
    author: 'user',
    voteScore: 6,
    deleted: false,
    postDeleted: false,
  },
  "8tu4bsun805n8un48ve89": {
    id: '8tu4bsun805n8un48ve89',
    postId: "8xf0y6ziyjabvozdd253nd",
    parentId: '894tuq4ut84ut8v4t8wun89g',
    ancestorId: '894tuq4ut84ut8v4t8wun89g',
    children: [],
    timestamp: 1469479767190,
    body: 'Comments. Are. Cool.',
    author: 'user',
    voteScore: -5,
    deleted: false,
    postDeleted: false,
  },
};

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

/**
 * @description Get all comments belonging to a post
 * @param {string} postId
 * @returns {array} comment objects with a shared post
 */
function getByParent (postId) {
  return new Promise((res) => {
    const comments = getData()
    const keys = Object.keys(comments)
    filtered_keys = keys.filter(key => comments[key].postId === postId && !comments[key].deleted)
    res(filtered_keys.map(key => comments[key]))
  });
}

/**
 * @description Get a specific comment by id
 * @param {string} 
 * @returns {object} comment details
 */
function get (commentId) {
  return new Promise((res) => {
    const comments = getData();
    res(
      comments[commentId].deleted || comments[commentId].postDeleted
        ? {}
        : comments[commentId]      
      );
  });
}

/**
 * @description Get posts by array of ids
 * @param {array} postIds
 * @returns {array} batch of posts by ids
 */
function getByIds (commentIds) {
  const comments = getData();
  return new Promise((res) => {
    res(commentIds.map(id => comments[id]));
  });
}

/**
 * @description Add a new comment object
 * @param {string} sessionToken - action validation
 * @param {object} comment - contains comment details 
 */
function add (sessionToken, comment) {
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, comment.author)
      .then(data => {
        const comments = getData();
        const id = uuidv4();
        comments[id] = {
          id,
          timestamp: Date.now(),
          body: comment.body,
          author: comment.author,
          postId: comment.postId,
          parentId: comment.parentId !== 'null' ? comment.parentId : null,
          ancestorId: comment.ancestorId !== 'null' ? comment.ancestorId : null,
          children: [],
          voteScore: 1,
          deleted: false,
          postDeleted: false,
        };

        if (comment.parentId !== 'null') {
          comments[comment.parentId].children.push(id);
        }

        res(comments[id]);
    }).catch(err => reject(err));
  });
}

/**
 * @description Vote on a comment
 * @param {string} sessionToken
 * @param {string} commentId
 * @param {string} option, i.e. 'upVote'/'downVote'
 */
function vote (commentId, option, previousVote) {
  return new Promise((res, reject) => {
    const comments = getData();
    comment = comments[commentId];
    let delta = 0;
    if ((!previousVote && option === 'upVote') ||
      (!option && previousVote === 'downVote')) {
      delta = 1;
    } else if ((!previousVote && option === 'downVote') ||
      (!option && previousVote === 'upVote')) {
      delta = -1;
    } else if (previousVote === 'downVote' && option ==='upVote') {
      delta = 2;
    } else if (previousVote === 'upVote' && option === 'downVote') {
      delta = -2;
    } else {
      console.log(`Duplicated vote on comment: ${commentId}.`);
      reject(403);
    }
    comment.voteScore += delta;
    res(comment);
  });
}

/**
 * @description Disable a comment if its post is disabled
 * @param {string} sessionToken
 * @param {object} disabled post object
 */
function disableByPost (post) {
  return new Promise((res, reject) => {
    const comments = getData();
    keys = Object.keys(comments);
    filtered_keys = keys.filter(key => comments[key].postId === post.id);
    filtered_keys.forEach(key => comments[key].postDeleted = true);
    res(post);
  });
}

/**
 * @description Disable a specific comment
 * @param {string} sessionToken
 * @param {string} commentId
 */
function disable (sessionToken, commentId) {
  const comments = getData();
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, comments[commentId].author)
      .then(data => {
        const commentToDisable = comments[commentId];
        commentToDisable.deleted = true;
        res(comments[commentId]);
      }).catch(err => reject(err));
    });
}

/**
 * @description Edit a specific comment
 * @param {string} sessionToken
 * @param {string} commentId - updated comment id
 * @param {object} updatedComment - updated comment details
 */
function edit (sessionToken, commentId, updatedComment) {
  const comments = getData();
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, comments[commentId].author)
      .then(data => {
        Object.keys(updatedComment).forEach((prop) => {
          comments[commentId][prop] = updatedComment[prop];
        });
        res(comments[commentId]);
      }).catch(err => reject(err))
  });
}

module.exports = {
  get,
  getByIds,
  getByParent,
  add,
  vote,
  disableByPost,
  disable,
  edit,
};
