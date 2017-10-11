const {
  verifySessionToken,
  getSortedList,
  getRestrictedList,
} = require('./utils');
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
    votes: {
      upVote: 6,
      downVote: 1.
    },
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
    votes: {
      upVote: 1,
      downVote: 6.
    },
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
function getByPost (postId, criterion, direction, offset, limit) {
  return new Promise((res) => {
    const dbComments = getData();
    const rawComments = Object.values(dbComments)
      .filter(c => c.postId === postId && !c.parentId);
    const sortedComments = getSortedList(rawComments, criterion);
    const depleted = offset + limit > rawComments.length - 1;
    const comments = getRestrictedList(sortedComments, direction, offset, limit);
    for (const comment of comments) {
      for (const childId of comment.children) {
        comments.push(dbComments[childId]);
      }
    }
    res({ comments, depleted });
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
function getByIds (commentIds, criterion, direction, offset, limit) {
  return new Promise((res) => {
    const dbComments = getData();
    const rawComments = commentIds.map(id => dbComments[id]);
    const selectedComments = getSortedList(rawComments, criterion);
    const depleted = offset + limit > selectedComments.length - 1;
    const commentsList = getRestrictedList(selectedComments, direction, offset, limit);
    res({ comments: commentsList, depleted });
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
          votes: {
            upVote: 1,
            downVote: 0,
          },
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
    if (previousVote && previousVote === option) {
      console.log(`Duplicated vote on comment: ${commentId}.`);
      reject(403);
      return;
    }
    if (option) {
      comment.votes[option] += 1;
    }
    if (previousVote && previousVote !== option) {
      comment.votes[previousVote] -= 1;
    }
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
        commentToDisable.deleted = !commentToDisable.deleted;
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
  getByPost,
  add,
  vote,
  disableByPost,
  disable,
  edit,
};
