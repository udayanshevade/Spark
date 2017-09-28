const Fuse = require('fuse.js');
const config = require('./config');
const { verifySessionToken } = require('./utils');

const db = {
  'react': {
    name: 'react',
    path: 'react',
    private: false,
    posts: ['8xf0y6ziyjabvozdd253nd'],
    blurb: 'Explore and discuss react.',
  },
  'redux': {
    name: 'redux',
    path: 'redux',
    private: false,
    posts: ['6ni6ok3ym7mf1p33lnez', 'llgj1kasd78f1ptk1nz1'],
    blurb: 'Explore and discuss redux.',
  },
  'udacity': {
    name: 'udacity',
    path: 'udacity',
    private: false,
    posts: [],
    blurb: 'Explore and discuss Udacity.',
  }
};

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

const fuseOptions = {
  keys: ['name'],
};

const fuse = new Fuse(Object.values(getData()), fuseOptions);

/**
 * @description Gets all (matching) categories
 */
function getAll (query) {
  return new Promise((res) => {
    const db = getData();
    let categories = Object.values(db);
    if (query) {
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
            name: data.name,
            path: data.name,
            blurb: data.blurb,
            posts: [],
            private: data.private,
          };
          res({ success: 'Category added' });
        }
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  getAll,
  getCategoryPosts,
  addPost,
  switchPostCategory,
  add,
};
