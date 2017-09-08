const { verifySessionToken } = require('./utils');

const db = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1467166872634,
    title: 'Udacity is the best place to learn React',
    body: 'Everyone says so after all.',
    author: 'thingtwo',
    category: 'react',
    comments: [],
    voteScore: 6,
    deleted: false 
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    timestamp: 1468479767190,
    title: 'Learn Redux in 10 minutes!',
    body: 'Just kidding. It takes more than 10 minutes to learn technology.',
    author: 'thingone',
    category: 'redux',
    comments: [],
    voteScore: -5,
    deleted: false
  }
}

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

/**
 * @description Get all active posts by a specified category
 * @param {string} category
 * @returns {array} all post objects matching a category
 */
function getByCategory (category) {
  return new Promise((res) => {
    const posts = getData();
    const keys = Object.keys(posts);
    const filtered_keys = keys.filter(key => posts[key].category === category && !posts[key].deleted);
    res(filtered_keys.map(key => posts[key]));
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
function getByIds (postIds) {
  return new Promise((res) => {
    const posts = getData();
    res(postIds.map(id => posts[id]));
  });
}

/**
 * @description Get all posts
 * @returns {array} all post data
 */
function getAll () {
  return new Promise((res) => {
    const posts = getData();
    const keys = Object.keys(posts);
    const filtered_keys = keys.filter(key => !posts.deleted);
    res(filtered_keys.map(key => posts[key]));
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
function vote (sessionToken, postId, option, userId) {
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, userId)
        .then(data => {
          const posts = getData();
          post = posts[postId];
          let delta;
          switch(option) {
            case "upVote":
              delta = 1;
              break;
            case "downVote":
              delta = -1;
              break;
            default:
              console.log(`posts.vote received incorrect parameter: ${option}`);
          }
          post.voteScore += delta;
          res(post);
        }).catch(err => reject(err));
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
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, posts[postId].author)
      .then(data => {
        const posts = getData();
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
  getByCategory,
  add,
  vote,
  disable,
  edit,
  getAll,
};