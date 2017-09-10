const Fuse = require('fuse.js');
const config = require('./config');

const db = {
  'react': {
    name: 'react',
    path: 'react',
    private: false
  },
  'redux': {
    name: 'redux',
    path: 'redux',
    private: false
  },
  'udacity': {
    name: 'udacity',
    path: 'udacity',
    private: false
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

module.exports = {
  getAll,
};
