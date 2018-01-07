const Fuse = require('fuse.js');

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
async function getAll (pool, query, namesOnly) {
  const queryText = namesOnly
    ? 'SELECT name FROM categories'
    : `SELECT name, creator, private, blurb, COUNT(category) AS subscribers
        FROM categories LEFT JOIN category_subscriptions ON name = category
        GROUP BY categories.name`;
  try {
    const data = await pool.query(queryText);
    const { rows: results } = data;
    let categories = results;
    if (query) {
      const fuse = getFuseObject(results);
      categories = fuse.search(query);
    }
    return categories;
  } catch (e) {
    console.error(e);
    return { error: 500 };
  }
}

/**
 * @description Get specific category
 */
async function get (pool, category) {
  try {
    const res = await pool.query(
      `SELECT name, creator, private, blurb, COUNT(category) AS subscribers
        FROM categories LEFT JOIN category_subscriptions ON name = category
        WHERE name = $1
        GROUP BY categories.name`,
      [category]);
    const { rows } = res;
    if (!rows) {
      return { error: 500 };
    } else {
      return rows[0];
    }
  } catch (e) {
    return { error: 500 };
  }
}

/**
 * @description Create a category
 */
async function create (client, data) {
  let result;
  try {
    await client.query('BEGIN');
    // Add category
    const insertCategoryText = 'INSERT INTO categories VALUES($1, $2, $3)';
    const insertCategoryVals = [data.name, data.user, data.blurb];
    await client.query(insertCategoryText, insertCategoryVals);
    // Automatically subscribe creator
    const insertSubscriptionText = 'INSERT INTO category_subscriptions VALUES($1, $2)';
    const insertSubscriptionVals = [data.name, data.user];
    await client.query(insertSubscriptionText, insertSubscriptionVals);
    await client.query('COMMIT');
    result = { success: 'Category added' };
  } catch (e) {
    client.query('ROLLBACK');
    console.error(e);
    result = { error: 500 };
  } finally {
    client.release();
    return result;
  }
}

async function subscribe (client, params, body) {
  const { category: reqCategory, update: reqUpdate } = params;
  let result;
  try {
    await client.query('BEGIN');
    let insertSubscriptionText;
    switch (reqUpdate) {
      case 'subscribe':
        insertSubscriptionText = 'INSERT INTO category_subscriptions VALUES($1, $2)';
        break;
      case 'unsubscribe':
        insertSubscriptionText = 'DELETE FROM category_subscriptions \
          WHERE category = $1 AND user_id = $2';
      default:
        break;
    }
    const insertSubscriptionVals = [reqCategory, body.userId];
    await client.query(insertSubscriptionText, insertSubscriptionVals);
    await client.query('COMMIT');
    result = { success: 'Category created' };
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    result = { error: 500 };
  } finally {
    client.release();
    return result;
  }
}  

module.exports = {
  get,
  getAll,
  create,
  subscribe,
};
