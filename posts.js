const Fuse = require('fuse.js');
const { verifySessionToken } = require('./utils');

const db = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1467166872634,
    title: 'Udacity is the best place to learn React',
    url: 'https://www.udacity.com',
    body: 'Everyone says so after all.',
    author: 'user',
    category: 'react',
    comments: ['894tuq4ut84ut8v4t8wun89g', '8tu4bsun805n8un48ve89'],
    voteScore: 6,
    deleted: false, 
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    timestamp: 1468479767190,
    title: 'Learn Redux in 10 minutes!',
    url: null,
    body: 'Just kidding. It takes more than 10 minutes to learn technology.',
    author: 'user',
    category: 'redux',
    comments: [],
    voteScore: 5,
    deleted: false,
  },
  "llgj1kasd78f1ptk1nz1": {
    id: 'llgj1kasd78f1ptk1nz1',
    timestamp: 1498439787190,
    title: 'Redux is easy!',
    url: null,
    body: 'But practice makes perfect.',
    author: 'user',
    category: 'redux',
    comments: [],
    voteScore: 15,
    deleted: false,
  },
}

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

const fuseOptions = {
  keys: [{
    name: 'title',
    weight: 0.6,
  }, {
    name: 'body',
    weight: 0.3,
  }, {
    name: 'category',
    weight: 0.1,
  }],
};

/**
 * @description Get all posts
 * @returns {array} all post data
 */
function getAll (query) {
  return new Promise((res) => {
    let posts = Object.values(getData()).filter(post => !post.deleted);
    if (query) {
      const fuse = new Fuse(posts, fuseOptions);
      // return matching
      posts = fuse.search(query);
    }
    res(posts);
  });
}

/**
 * @description Get a specific post by id
 * @param {string} id
 * @returns {object} post details 
 */
function get (postId) {
  return new Promise((res) => {
    const posts = getData();
    res(
      posts[postId].deleted 
        ? {}
        : posts[postId]
    );
  });
}

/**
 * @description Get posts by array of ids
 * @param {array} postIds
 * @returns {array} batch of posts by ids
 */
function getByIds (postIds, query) {
  return new Promise((res) => {
    const allPosts = getData();
    let selectedPosts = postIds.map(id => allPosts[id]);
    if (query) {
      const fuse = new Fuse(selectedPosts, fuseOptions);
      selectedPosts = fuse.search(query);
    }
    res(selectedPosts);
  });
}

/**
 * @description Add a new post object
 * @param {string} sessionToken - action validation
 * @param {object} post - contains post details 
 */
function add (sessionToken, post) {
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, post.author)
        .then(data => {
          const posts = getData();
          
          posts[post.id] = {
            id: post.id,
            timestamp: post.timestamp,
            title: post.title,
            body: post.body,
            author: post.author,
            category: post.category,
            comments: [],
            voteScore: 1,
            deleted: false,
          };
          res(posts[post.id]);
        })
        .catch(err => reject(err));
  });
}

/**
 * @description Vote on a post
 * @param {string} sessionToken
 * @param {string} postId
 * @param {string} option, i.e. 'upVote'/'downVote'
 */
function vote (postId, option, previousVote) {
  return new Promise((res, reject) => {
    const posts = getData();
    post = posts[postId];
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
      console.log(`Duplicated vote on post: ${postId}.`);
      reject(403);
    }
    post.voteScore += delta;
    res(post);
  });
}

/**
 * @description 'Delete' a post
 * @param {string} sessionToken
 * @param {string} postId
 */
function disable (sessionToken, postId, userId) {
    return new Promise((res, reject) => {
      verifySessionToken(sessionToken, userId)
          .then(data => {
            const posts = getData();
            posts[postId].deleted = true;
            res(posts[postId]);
          });
    }).catch(err => reject(err));
}

/**
 * @description Edit a post
 * @param {string} sessionToken
 * @param {string} postId
 * @param {string} post - updated details
 */
function edit (sessionToken, postId, editedPost) {
  const posts = getData();
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, posts[postId].author)
      .then(data => {
        Object.keys(editedPost).forEach((prop) => {
          posts[postId][prop] = editedPost[prop];
        });
        res(posts[postId]);
      }).catch(err => reject(err));
  });
}

module.exports = {
  get,
  getByIds,
  getAll,
  add,
  vote,
  disable,
  edit,
  getAll,
};