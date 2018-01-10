const { Pool } = require('pg');
const config = require('config');

const poolConfigObj = config.DATABASE_URL
  ? { connectionString: config.DATABASE_URL }
  : {
    username: 'vagrant',
    host: 'localhost',
    database: 'spark',
    password: 'password',
  };

const pool = new Pool(poolConfigObj);

pool.on('error', (err, client) => {
  console.log('Unexpected error', err);
});

async function query (text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

async function getClient () {
  try {
    const client = await pool.connect();
    return client;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const shouldAbort = (err, client) => {
  if (err) {
    console.error('Error in transaction:', err.stack);
    client.query('ROLLBACK', (err) => {
      if (err) {
        console.error('Error rolling back:', err.stack);
      }
      client.conclude();
    });
  }
  return !!err;
};

module.exports = {
  query,
  getClient,
  shouldAbort,
};
