const uuidv4 = require('uuid/v4');

/* sample schema
{
  id: '894tuq4ut84ut8v4t8wun89g',
  postId: "8xf0y6ziyjabvozdd253nd",
  parentId: null,
  children: ['8tu4bsun805n8un48ve89'],
  created: 1468166872634,
  body: 'Hi there! I am a COMMENT.',
  author: 'user',
  votes: {
    upVote: 6,
    downVote: 1,
  },
  deleted: false,
},
*/

const buildRecursiveCommentQuery = (
  constraint,
  sort,
  dir,
  rootLim,
  lim,
  descendantsOnly,
  depth
) => (
  `WITH RECURSIVE root_comments AS (
    SELECT
      comment_id,
      parent_id,
      post_id,
      body,
      author,
      created,
      deleted,
      sum(CASE WHEN vote = 'upVote' AND target_id = comment_id THEN 1 ELSE 0 END) OVER (PARTITION BY comment_id) as upvote,
      sum(CASE WHEN vote = 'downVote' AND target_id = comment_id THEN 1 ELSE 0 END) OVER (PARTITION BY comment_id) as downvote
    FROM comments LEFT JOIN votes ON comment_id = target_id
    ${constraint === 'post_id' ? 'WHERE post_id = $1' : ''}
  ), ancestor_comments AS (
    SELECT * FROM root_comments
      WHERE ${constraint === 'post_id' ? `parent_id IS NULL` : 'comment_id = $1'}
      ${sort} ${dir} ${rootLim}
  ), limited_comments AS (
    SELECT * FROM ancestor_comments ${lim}
  ), comments_by_constraint AS (
    SELECT
      comment_id,
      null parent_id,
      post_id,
      body,
      author,
      created,
      deleted,
      upvote,
      downvote,
      0 depth
    FROM limited_comments
      UNION
    SELECT
      root_comments.comment_id,
      root_comments.parent_id,
      root_comments.post_id,
      root_comments.body,
      root_comments.author,
      root_comments.created,
      root_comments.deleted,
      root_comments.upvote,
      root_comments.downvote,
      ancestor_children.depth + 1 AS depth
    FROM (
      SELECT root_comments.parent_id,
        comments_by_constraint.depth
      FROM root_comments, comments_by_constraint
      WHERE root_comments.parent_id = comments_by_constraint.comment_id
      AND comments_by_constraint.depth < ${depth}
    ) AS ancestor_children, root_comments
    WHERE ancestor_children.parent_id = root_comments.parent_id
), result_comments AS (
  SELECT * FROM comments_by_constraint
  UNION SELECT
    comment_id,
    parent_id,
    post_id,
    body,
    author,
    created,
    deleted,
    upvote,
    downvote,
    0 AS depth
  FROM ancestor_comments
) SELECT DISTINCT
    a.comment_id,
    a.parent_id,
    a.post_id,
    a.body,
    a.author,
    a.created,
    a.deleted,
    a.upvote,
    a.downvote,
    a.depth,
    (CASE WHEN a.depth < ${depth - 1} THEN true ELSE count(b.comment_id) OVER (PARTITION BY a.comment_id) = 0 END) AS depleted,
    (CASE WHEN a.depth < ${depth - 1} THEN array_remove(array_agg(b.comment_id) OVER (PARTITION BY a.comment_id), NULL) ELSE NULL END) AS children
  FROM result_comments AS a
    LEFT JOIN comments AS b
    ON a.comment_id = b.parent_id
    ${descendantsOnly ? 'WHERE a.depth > 0' : ''}`
);

function getCommentSortFragment (criterion) {
  const z = 1.96;
  const z2 = Math.pow(z, 2);
  const total = '(root_comments.upvote + root_comments.downvote)';
  const phat = `(root_comments.upvote / ${total})`;
  const confidenceStatementPrefix = `ORDER BY (CASE WHEN root_comments.upvote = 0 AND root_comments.downvote = 0 THEN 1 ELSE ((${phat} + (${z2} / (2 * ${total})))
      - (${z} * sqrt(((${phat} * (1 - ${phat})) + (${z2} / (4 * ${total}))) / ${total}))) / (1 + (${z2} / ${total}))`;
  const confidenceStatementSuffix = 'END)';
  const milsToHours = 3600;
  const timeFactor = 2;
  const timeElapsed = `EXTRACT(epoch FROM created) / ${milsToHours}`;
  const hotSortFragment = `(1 / power(${timeElapsed} + 2, ${timeFactor}))`;
  let commentsSortFragment = '';
  switch (criterion) {
    case 'score': {
      commentsSortFragment = 'ORDER BY (root_comments.upvote - root_comments.downvote)';
      break;
    }
    case 'new': {
      commentsSortFragment = 'ORDER BY created';
      break;
    }
    case 'best': {
      commentsSortFragment = `${confidenceStatementPrefix} ${confidenceStatementSuffix}`;
      break;
    }
    case 'hot': {
      commentsSortFragment = `${confidenceStatementPrefix} + ${hotSortFragment} ${confidenceStatementSuffix}`;
      break;
    }
    default: {
      commentsSortFragment = '';
    }
  }
  return commentsSortFragment;
}

/**
 * @description Get chain of comments as constrained
 * can be by post_id, user_id, or parent_id
 */
async function getComments (
  pool,
  constraint,
  criterion,
  direction,
  descendantsOnly,
  offset = 0,
  limit = 10
) {
  const depth = 6;
  let commentsResult = { error: 500 };
  try {
    const commentsSortFragment = getCommentSortFragment(criterion);
    const directionFragment = direction === 'desc' ? 'DESC' : 'ASC';
    const rootOffsetFragment = `LIMIT $2 OFFSET $3`;
    const offsetFragment = `LIMIT $4`;
    const commentsQueryText = buildRecursiveCommentQuery(
      constraint.key,
      commentsSortFragment,
      directionFragment,
      rootOffsetFragment,
      offsetFragment,
      descendantsOnly,
      depth
    );
    const commentsQueryVals = [constraint.value, limit + 1, offset, limit];
    const { rows: rawComments } = await pool.query(commentsQueryText, commentsQueryVals);
    if (!rawComments) {
        return commentsResult;
    } else {
      let depleted = true;
      let count = 0;
      let limited = true;
      const comments = rawComments.filter(c => {
        if (!c.parent_id) {
          limited = count < limit;
          count += 1;
          if (!limited && depleted) {
            depleted = false;
          }
        }
        return (!c.parent_id && limited) || c.parent_id;
      }).map((raw) => ({
        id: raw.comment_id,
        children: raw.children || [],
        parentId: raw.parent_id,
        postId: raw.post_id,
        created: raw.created,
        body: raw.body,
        author: raw.author,
        votes: {
          upVote: +raw.upvote,
          downVote: +raw.downvote,
        },
        deleted: raw.deleted,
        depleted: raw.depleted,
        depth: raw.depth,
      }));
      return { comments, depleted };
    }
  } catch (e) {
    console.error(e);
    return commentsResult;
  }
}

async function add (client, details) {
  let response = { error: 500 };
  try {
    await client.query('BEGIN');
    const addCommentText = `INSERT INTO comments
      (comment_id, parent_id, post_id, body, author)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const commentId = uuidv4();
    const { postId, parentId: rawParentId, body, author } = details;
    const parentId = rawParentId === 'null' ? null : rawParentId;
    const addCommentVals = [commentId, parentId, postId, body, author];
    res = await client.query(addCommentText, addCommentVals);
    const addAuthorVoteText = 'INSERT INTO votes VALUES($1, $2, $3)';
    const addAuthorVoteVals = [author, commentId, 'upVote'];
    await client.query(addAuthorVoteText, addAuthorVoteVals);
    await client.query('COMMIT');
    if (res.rows.length) {
      const commentData = res.rows[0];
      response = {
        author: commentData.author,
        postId: commentData.post_id,
        parentId: commentData.parent_id,
        body: commentData.body,
        id: commentId,
        deleted: commentData.deleted,
        created: commentData.created,
        votes: {
          upVote: 1,
          downVote: 0,
        },
        children: [],
      };
    }
  } catch (e) {
    console.error(e);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    return response;
  }
}

async function edit (client, id, body) {
  let response = { errors: 500 };
  try {
    await client.query('BEGIN');
    const commentEditText = 'UPDATE comments SET body = $1 WHERE comment_id = $2';
    const commentEditVals = [body, id];
    await client.query(commentEditText, commentEditVals);
    await client.query('COMMIT');
    response = { success: 'Comment edited' };
  } catch (e) {
    console.error(e);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    return response;
  }
}

async function deleteComment (client, id, shouldDelete) {
  let response = { errors: 500 };
  try {
    await client.query('BEGIN');
    const commentDeleteText = `UPDATE comments SET deleted = $1
      WHERE comment_id = $2`;
    const doDelete = shouldDelete === 'delete';
    const commentDeleteVals = [doDelete, id];
    await client.query(commentDeleteText, commentDeleteVals);
    await client.query('COMMIT');
    response = { success: `Comment ${shouldDelete === 'delete' ? 'deleted' : 'restored'}` };
  } catch (e) {
    console.error(e);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    return response;
  }
}

async function getUserComments (
  client,
  user,
  criterion,
  direction,
  offset = 0,
  limit = 10
) {
  try {
    const commentsQueryText = `SELECT
        comment_id,
        parent_id,
        post_id,
        body,
        author,
        created,
        deleted,
        sum(CASE WHEN vote = 'upVote' AND target_id = comment_id THEN 1 ELSE 0 END) OVER (PARTITION BY comment_id) as upvote,
        sum(CASE WHEN vote = 'downVote' AND target_id = comment_id THEN 1 ELSE 0 END) OVER (PARTITION BY comment_id) as downvote
      FROM comments
      LEFT JOIN votes ON comment_id = target_id
      WHERE author = $1
      ORDER BY $2${direction === 'desc' ? ' DESC' : ''}
      LIMIT $3 OFFSET $4`;
    const commentsQueryVals = [user, 'created', limit, offset];
    const { rows } = await client.query(commentsQueryText, commentsQueryVals);
    if (!rows) return { error: 500 };
    const depleted = offset + limit > rows.length - 1;
    const comments = rows.map(r => ({
      id: r.comment_id,
      parentId: r.parent_id,
      postId: r.post_id,
      body: r.body,
      author: r.author,
      created: r.created,
      deleted: r.deleted,
      votes: {
        upVote: +r.upvote,
        downVote: +r.downvote,
      },
    }));
    return { comments, depleted };
  } catch (e) {
    console.error(e);
    return { error: 500 };
  }
}

module.exports = {
  getComments,
  getUserComments,
  add,
  edit,
  deleteComment,
};
