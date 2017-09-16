const Fuse = require('fuse.js');
const config = require('./config');

const db = {
  'react': {
    name: 'react',
    path: 'react',
    private: false,
    posts: ['8xf0y6ziyjabvozdd253nd'],
  },
  'redux': {
    name: 'redux',
    path: 'redux',
    private: false,
    posts: ['6ni6ok3ym7mf1p33lnez', 'llgj1kasd78f1ptk1nz1'],
  },
  'udacity': {
    name: 'udacity',
    path: 'udacity',
    private: false,
    posts: [],
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
  return new Promise((res) => {
    const db = getData();
    const category = db[cat];
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

module.exports = {
  getAll,
  getCategoryPosts,
  addPost,
};
