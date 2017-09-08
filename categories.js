const config = require('./config')

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
}

/**
 * @description Access database
 */
function getData () {
  const data = db;
  return data;
}

/**
 * @description Gets all categories
 */
function getAll () {
  return new Promise((res) => {
    res(getData()); 
  });
}

module.exports = {
  getAll,
};
