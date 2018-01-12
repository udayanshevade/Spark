const Fuse = require('fuse.js');
const {
  verifySessionToken,
  getSortedList,
  getRestrictedList,
} = require('./utils');
const uuidv4 = require('uuid/v4');

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
 * @description Get a specific post by id
 * @param {string} id
 * @returns {object} post details 
 */
async function get (pool, postId) {
  try {
    const postQueryText = `SELECT DISTINCT
        post_id,
        title,
        url,
        body,
        category,
        author,
        created,
        deleted,
        sum(
          CASE WHEN vote = 'upVote'
            AND target_id = post_id
            THEN 1 ELSE 0 END
          ) OVER (PARTITION BY post_id)
        as upvote,
        sum(
          CASE WHEN vote = 'downVote'
            AND target_id = post_id
            THEN 1 ELSE 0 END
          ) OVER (PARTITION BY post_id)
        as downvote
      FROM posts LEFT JOIN votes
      ON post_id = target_id
      WHERE post_id = $1`;
    const postQueryVal = [postId];
    const data = await pool.query(postQueryText, postQueryVal);
    const { rows } = data;
    if (!rows) return { error: 500 };
    const row = rows[0];
    if (!row) return {};
    return row.deleted
      ? {
        id: row.post_id,
        author: row.author,
        deleted: row.deleted,
        category: row.category,
      }
      : {
        id: row.post_id,
        title: row.title,
        url: row.url,
        body: row.body,
        category: row.category,
        author: row.author,
        created: row.created,
        deleted: row.deleted,
        votes: {
          upVote: +row.upvote,
          downVote: +row.downvote,
        },
      };
  } catch (e) {
    console.error(e);
    return { error: 500 };
  }
}

/**
 * @description Get post as constrained
 */
async function getPosts (pool, constraint, query, criterion, direction, offset = 0, limit = 10) {
  try {
    const postsQueryPrefix = `WITH basic_posts AS (
      SELECT
        posts.post_id,
        title,
        url,
        posts.body,
        category,
        posts.author,
        posts.created,
        posts.deleted,
        count(comment_id) as comments
      FROM posts
      LEFT JOIN comments USING (post_id)
      WHERE`;
    const postsQuerySuffix = `NOT posts.deleted
        GROUP BY post_id
      ) SELECT DISTINCT
        post_id,
        url,
        body,
        title,
        category,
        author,
        created,
        deleted,
        comments,
        sum(
          CASE WHEN vote = 'upVote'
            AND target_id = post_id
            THEN 1 ELSE 0 END
          ) OVER (PARTITION BY post_id)
        as upvote,
        sum(
          CASE WHEN vote = 'downVote'
            AND target_id = post_id
            THEN 1 ELSE 0 END
          ) OVER (PARTITION BY post_id)
        as downvote
      FROM basic_posts LEFT JOIN votes
      ON post_id = target_id`;
    let dbRes;
    if (!constraint) {
      const postsQueryText = `${postsQueryPrefix} ${postsQuerySuffix}`;
      dbRes = await pool.query(postsQueryText);
    } else {
      const postsQueryFragment = `${constraint.key} = $1 AND`;
      const postsQueryText = `${postsQueryPrefix} ${postsQueryFragment} ${postsQuerySuffix}`;
      dbRes = await pool.query(postsQueryText, [constraint.value]);
    }
    const { rows } = dbRes;
    if (!rows) return { error: 500 };
    let selectedPosts = rows.map(row => ({
      id: row.post_id,
      url: row.url,
      body: row.body,
      title: row.title,
      category: row.category,
      author: row.author,
      created: row.created,
      deleted: row.deleted,
      comments: +row.comments,
      votes: {
        upVote: +row.upvote,
        downVote: +row.downvote,
      },
    }));
    if (query) {
      const fuse = new Fuse(selectedPosts, fuseOptions);
      selectedPosts = fuse.search(query);
    } else {
      selectedPosts = getSortedList(selectedPosts, criterion);
    }
    const depleted = offset + limit > selectedPosts.length - 1;
    const posts = getRestrictedList(selectedPosts, direction, offset, limit);
    return { posts, depleted };
  } catch (e) {
    console.error(e);
    return { error: 500 };
  }
}

async function add (client, post) {
  let response;
  try {
    await client.query('BEGIN');
    const postId = uuidv4();
    // Add post
    const postAddText = `INSERT INTO posts (
      post_id, title, category, author, url, body)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING post_id as id,
        title,
        category,
        author,
        url,
        body,
        deleted,
        created,
        0 as comments`;
    const postAddVals = [
      postId,
      post.title,
      post.category,
      post.author,
      post.url,
      post.body,
    ];
    const { rows } = await client.query(postAddText, postAddVals);
    const postVoteText = 'INSERT INTO votes VALUES($1, $2, $3)';
    const postVoteVals = [post.author, postId, 'upVote'];
    const res = await client.query(postVoteText, postVoteVals);
    await client.query('COMMIT');
    response = rows[0];
    response.votes = {
      upVote: 1,
      downVote: 0,
    };
  } catch (e) {
    console.error(e);
    client.query('ROLLBACK');
    if (e.message.indexOf('foreign key constraint "posts_category_fkey"') > -1) {
      console.log('error of interest');
      response = { error: 403.1 };
    } else {
      console.log('Unknown error');
      response = { error: 500 };
    }
  } finally {
    client.release();
    return response;
  }
}

async function deletePost (client, params) {
  let response;
  try {
    await client.query('BEGIN');
    let postDeleteText;
    switch (params.delete) {
      case 'restore':
        postDeleteText = `WITH returned AS (
          UPDATE posts SET deleted = false
            WHERE post_id = $1 RETURNING *
          ) SELECT DISTINCT
            title,
            url,
            body,
            created,
            deleted,
            sum(
              CASE WHEN vote = 'upVote'
                AND target_id = post_id
                THEN 1 ELSE 0 END
              ) OVER (PARTITION BY post_id)
            as upvote,
            sum(
              CASE WHEN vote = 'downVote'
                AND target_id = post_id
                THEN 1 ELSE 0 END
              ) OVER (PARTITION BY post_id)
            as downvote
          FROM returned LEFT JOIN votes ON post_id = target_id;`;
        break;
      default:
        postDeleteText = 'UPDATE posts SET deleted = true WHERE post_id = $1';
        break;
    }
    const { rows } = await client.query(postDeleteText, [params.id]);
    await client.query('COMMIT');
    if (!rows.length) {
      response = {};
    } else {
      const row = rows[0];
      console.log(rows);
      response = {
        title: row.title,
        url: row.url,
        body: row.body,
        category: row.category,
        author: row.author,
        created: row.created,
        deleted: row.deleted,
        votes: {
          upVote: +row.upvote,
          downVote: +row.downvote,
        },
      };
    }
  } catch (e) {
    console.error(e);
    client.query('ROLLBACK');
    response = { error: 500 };
  } finally {
    client.release();
    return response;
  }
}

async function edit (client, postId, body) {
  let response;
  try {
    await client.query('BEGIN');
    const changedColumns = Object.keys(body);
    const changedLen = changedColumns.length;
    const updatePostText = `UPDATE posts
      SET ${changedColumns.map((k, n) => `${k} = $${n + 1}`)}
      FROM (
        SELECT
          p.title,
          p.url,
          p.body,
          p.category,
          p.author,
          p.created,
          p.deleted,
          sum(
            CASE WHEN vote = 'upVote'
              AND target_id = post_id
              THEN 1 ELSE 0 END
            ) OVER (PARTITION BY post_id)
          as upvote,
          sum(
            CASE WHEN vote = 'downVote'
              AND target_id = post_id
              THEN 1 ELSE 0 END
            ) OVER (PARTITION BY post_id)
          as downvote
        FROM posts AS p LEFT JOIN votes AS v
        ON post_id = target_id
      ) AS votes_post
      WHERE post_id = $${changedLen + 1}
      RETURNING posts.title,
        posts.url,
        posts.body,
        posts.category,
        posts.author,
        posts.created,
        posts.deleted,
        upvote,
        downvote`;
    const updatePostVals = changedColumns.map(k => body[k]);
    updatePostVals.push(postId);
    const { rows } = await client.query(updatePostText, updatePostVals);
    const row = rows[0];
    const { upvote, downvote, ...data} = row;
    data.votes = {
      upVote: +upvote,
      downVote: +downvote,
    };
    data.id = postId;
    response = { data };
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    response = { error: 500 };
  } finally {
    client.release();
    return response;
  }
}

module.exports = {
  get,
  getPosts,
  add,
  deletePost,
  edit,
};