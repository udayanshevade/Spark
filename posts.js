const Fuse = require('fuse.js');
const {
  verifySessionToken,
  getSortedList,
  getRestrictedList,
} = require('./utils');
const uuidv4 = require('uuid/v4');

const db = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    timestamp: 1498454400220,
    title: 'Udacity is the best place to learn React',
    url: 'https://www.udacity.com',
    body: 'Everyone says so after all.',
    author: 'user',
    category: 'react',
    comments: ['894tuq4ut84ut8v4t8wun89g', '8tu4bsun805n8un48ve89'],
    votes: {
      upVote: 11,
      downVote: 5,
    },
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
    votes: {
      upVote: 10,
      downVote: 5,
    },
    deleted: false,
  },
  "llgj1kasd78f1ptk1nz1": {
    id: 'llgj1kasd78f1ptk1nz1',
    timestamp: 1459735617190,
    title: 'Redux is easy!',
    url: null,
    body: 'But practice makes perfect.',
    author: 'user',
    category: 'redux',
    comments: [],
    votes: {
      upVote: 19,
      downVote: 10,
    },
    deleted: false,
  },
  "llgj1kjg278f1ptk1nz1": {
    id: 'llgj1kjg278f1ptk1nz1',
    timestamp: 1406758287190,
    title: 'Redux is easy!',
    url: null,
    body: 'But practice makes perfect.',
    author: 'user',
    category: 'redux',
    comments: [],
    votes: {
      upVote: 19,
      downVote: 10,
    },
    deleted: false,
  },
  "kqgj1kasd78f66fagnz1": {
    id: 'kqgj1kasd78f66fagnz1',
    timestamp: 1507234587136,
    title: 'Everything can be done!',
    url: null,
    body: 'You just gotta want it, and have some luck.',
    author: 'user',
    category: 'udacity',
    comments: [],
    votes: {
      upVote: 9,
      downVote: 7,
    },
    deleted: false,
  },
  "plg1dausd78fa11dauz1": {
    id: 'plg1dausd78fa11dauz1',
    timestamp: 1336341718190,
    title: 'Redux is easy!',
    url: null,
    body: 'Redux is a good tool.',
    author: 'user',
    category: 'redux',
    comments: [],
    votes: {
      upVote: 25,
      downVote: 14,
    },
    deleted: false,
  },
  "kogj1kasas171ptk1aj1": {
    id: 'kogj1kasas171ptk1aj1',
    timestamp: 1442817787235,
    title: 'React is easy!',
    url: null,
    body: 'Reacting fast.',
    author: 'user',
    category: 'react',
    comments: [],
    votes: {
      upVote: 12,
      downVote: 13,
    },
    deleted: false,
  },
  "hggjgy32d78faaas1nf4": {
    id: 'hggjgy32d78faaas1nf4',
    timestamp: 1148752381293,
    title: 'Keep it classy.',
    url: null,
    body: '',
    author: 'user',
    category: 'udacity',
    comments: [],
    votes: {
      upVote: 3,
      downVote: 1,
    },
    deleted: false,
  },
  "mlgjgfwh1d78f1ack1123": {
    id: 'mlgjgfwh1d78f1ack1123',
    timestamp: 1458474281234,
    title: 'This is a repost.',
    url: null,
    body: 'Reposts are allowed.',
    author: 'user',
    category: 'react',
    comments: [],
    votes: {
      upVote: 15,
      downVote: 9,
    },
    deleted: false,
  },
  "ghjea8asd78f1pj42171": {
    id: 'ghjea8asd78f1pj42171',
    timestamp: 1445679786288,
    title: 'Redux is easy!',
    url: null,
    body: 'But practice makes perfect.',
    author: 'user',
    category: 'redux',
    comments: [],
    votes: {
      upVote: 5,
      downVote: 13,
    },
    deleted: false,
  },
  "haj871asd78f1pjgs713": {
    id: 'haj871asd78f1pjgs713',
    timestamp: 1395639721190,
    title: 'Redux is easy!',
    url: null,
    body: 'But practice makes perfect.',
    author: 'user',
    category: 'redux',
    comments: [],
    votes: {
      upVote: 21,
      downVote: 17,
    },
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

/**
 * @description Get posts array
 */
function getPostsList () {
  const db = getData();
  return Object.values(db).filter(post => !post.deleted);
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
function getAll (query, criterion, direction, offset = 0, limit = 10) {
  return new Promise((res) => {
    const rawPosts = getPostsList();
    let posts = [];
    if (query) {
      const fuse = new Fuse(rawPosts, fuseOptions);
      // return matching
      posts = fuse.search(query);
    } else {
      posts = getSortedList(rawPosts, criterion);
    }
    const depleted = offset + limit > posts.length - 1;
    const postsList = getRestrictedList(posts, direction, offset, limit);
    res({ posts: postsList, depleted });
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
      posts[postId]
        ? posts[postId]
        : {}
    );
  });
}

/**
 * @description Get posts by array of ids
 * @param {array} postIds
 * @returns {array} batch of posts by ids
 */
function getByIds (postIds, criterion, direction, offset, limit) {
  return new Promise((res) => {
    const dbPosts = getData();
    const rawPosts = postIds.map(id => dbPosts[id])
      .filter(post => !post.deleted);
    const selectedPosts = getSortedList(rawPosts, criterion);
    const depleted = offset + limit > selectedPosts.length - 1;
    const postsList = getRestrictedList(selectedPosts, direction, offset, limit);
    res({ posts: postsList, depleted });
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
          const id = uuidv4();
          posts[id] = {
            id,
            timestamp: Date.now(),
            title: post.title,
            url: post.url || '',
            body: post.body || '',
            category: post.category,
            author: post.author,
            comments: [],
            votes: {
              upVote: 1,
              downVote: 0,
            },
            deleted: false,
          };
          res(posts[id]);
        })
        .catch(err => reject(err));
  });
}

/**
 * @description Add comment to post
 * @param {string} postId 
 * @param {string} commentId 
 */
function addComment (postId, commentId) {
  const posts = getData(); 
  const post = posts[postId];
  if (!post) return;
  post.comments.unshift(commentId);
}

/**
 * @description Add comment to post
 * @param {string} postId 
 * @param {string} commentId 
 */
function removeComment (postId, commentId) {
  const posts = getData(); 
  const post = posts[postId];
  if (!post) return;
  post.comments = post.comments.filter(id => id !== commentId);
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
    if (previousVote && previousVote === option) {
      console.log(`Duplicated vote on post: ${postId}.`);
      reject(403);
      return;
    }
    if (option) {
      post.votes[option] += 1;
    }
    if (previousVote && previousVote !== option) {
      post.votes[previousVote] -= 1;
    }
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
        const currentPost = posts[postId];
        const { category: newCategory } = editedPost;
        const oldCategory = currentPost.category !== newCategory
          ? currentPost.category
          : null;
        Object.keys(editedPost).forEach((prop) => {
          currentPost[prop] = editedPost[prop];
        });
        res({ data: posts[postId], oldCategory });
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
  addComment,
  removeComment,
};