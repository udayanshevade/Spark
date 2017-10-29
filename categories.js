const Fuse = require('fuse.js');
const config = require('./config');
const { verifySessionToken } = require('./utils');

const db = {
  'react': {
    name: 'react',
    path: 'react',
    creator: 'user',
    private: false,
    posts: ['8xf0y6ziyjabvozdd253nd'],
    blurb: 'Explore and discuss react.',
    subscribers: 1,
  },
  'redux': {
    name: 'redux',
    path: 'redux',
    creator: 'user',
    private: false,
    posts: ['6ni6ok3ym7mf1p33lnez', 'llgj1kasd78f1ptk1nz1'],
    blurb: 'Explore and discuss redux.',
    subscribers: 1,
  },
  'udacity': {
    name: 'udacity',
    path: 'udacity',
    creator: 'user',
    private: false,
    posts: [],
    blurb: 'Explore and discuss Udacity.',
    subscribers: 1,
  }
};

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

/**
 * @description Get specific category
 */
function get (category) {
  return new Promise((res, reject) => {
    const db = getData();
    if (!db[category]) {
      reject(403);
    }
    res(db[category]);
  });
}

const fuseOptions = {
  keys: ['name'],
};

const getFuseObject = (dbVals) => {
  const fuse = new Fuse(dbVals, fuseOptions);
  return fuse;
};

/**
 * @description Gets all (matching) categories
 */
function getAll (query) {
  return new Promise((res) => {
    const db = getData();
    let categories = Object.values(db);
    if (query) {
      const fuse = getFuseObject(categories);
      // return matching
      categories = fuse.search(query);
    }
    res(categories);
  });
}

/**
 * @description Get post ids per category
 */
function getCategoryPosts (cat) {
  return new Promise((res, reject) => {
    const db = getData();
    const category = db[cat];
    if (!category) reject(403);
    const { posts } = category;
    res(posts);
  });
}

/**
 * @description Get post ids per category
 */
function addPost (cat, postId) {
  const db = getData();
  const category = db[cat];
  category.posts.unshift(postId);
}

/**
 * @description Change post category
 */
function switchPostCategory (postId, newCategory, oldCategory) {
  const db = getData();
  db[oldCategory].posts = db[oldCategory].posts.filter(id => id !== postId);
  db[newCategory].posts.unshift(postId);
}

/**
 * @description Adds a new category
 */
function add (sessionToken, data) {
  return new Promise((res, reject) => {
    verifySessionToken(sessionToken, data.user)
      .then(() => {
        const db = getData();
        if (db[data.name]) {
          reject(403);
        } else {
          db[data.name] = {
            creator: data.user,
            name: data.name,
            path: data.name,
            blurb: data.blurb,
            posts: [],
            subscribers: 1,
            private: data.private,
          };
          res({ success: 'Category added' });
        }
      })
      .catch(err => reject(err));
  });
}

/**
 * @description Updates category subscription
 */
function updateSubscription ({ category, option }) {
  return new Promise((res, reject) => {
    const categories = getData();
    if (!categories[category]) {
      reject(403);
    } else {
      let updateBy;
      switch (option) {
        case 'subscribe': {
          updateBy = 1;
          break;
        }
        case 'unsubscribe': {
          updateBy = -1;
          break;
        }
        default: {
          updateBy = 0;
          break;
        }
      }
      categories[category].subscribers += updateBy;
    }
  });
}

module.exports = {
  get,
  getAll,
  getCategoryPosts,
  addPost,
  switchPostCategory,
  add,
  updateSubscription,
};
