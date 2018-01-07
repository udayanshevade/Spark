require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const clone = require('clone');
const config = require('./config');
const categories = require('./categories');
const posts = require('./posts');
const comments = require('./comments');
const user = require('./user');
const { handleErrorFn, verifySessionToken } = require('./utils');
const pool = require('./db');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(multer().single());

app.get('/', (req, res) => {
  const help = `
  <pre>
    Welcome to the Spark aggregator API!

    The following endpoints are available:

    GET /categories/get/:query*?
      USAGE: 
        Get data for categories.
      PARAMS:
        query: String - optional filter

    GET /categories/suggestions/:query*?
      USAGE:
        Get category names only.
      PARAMS:
        query: String

    GET /categories/category/:category
      USAGE:
        Get data for single, specific category.
      PARAMS:
        category: String

    GET /categories/category/:category/posts/:query*?
      USAGE:
        Get posts for a given category
      PARAMS:
        query: optional filter

    POST /categories/create
      USAGE:
        Create a category.
      BODY:
        name: String - category name
        body: String - description

    POST /categories/subscribe/:category/:update
      USAGE:
        Updates a user subscription for a given category.
      PARAMS:
        category: String
        update: String - "unsubscribe" or "subscribe"

    GET /posts/get/:query*?
      USAGE:
        Get data for all posts. Optional query to filter.
      PARAMS:
        query: String - optional filter

    GET /posts/thread/:id
      USAGE:
        Get the details of a single post
      PARAMS:
        id: String

    POST /posts
      USAGE:
        Add a new post
      PARAMS: 
        id: UUID
        title: String
        body: String
        author: String
        category: String

    PUT /votes/:id/vote
      USAGE:
        Vote on a post
      PARAMS:
        id: String - id of the target
      BODY:
        voterId: String - id of the user
        option: String - can be "upVote", "downVote" or null

    PUT /posts/thread/:id/:author/edit
      USAGE:
        Edit the details of an existing post
      PARAMS:
        id: String - id of the post
        author: String - id of the poster
      BODY:
        title: String
        body: String
        url: String
        category: String

    DELETE /posts/thread/:id/:author/:delete
      USAGE:
        Sets the deleted value for a post to 'true'. 
        The post becomes accessible.
      PARAMS:
        id: String
        author: String
        delete: String - option to delete / restore

    GET /posts/thread/:id/comments
      USAGE:
        Get all the comments for a single post
      PARAMS:
        id: String

    GET /comments/:id/:descendantsOnly*
      USAGE:
        Get all comments in a specific comment chain
      PARAMS:
        descendantsOnly - determines whether to exclude topmost comment

    POST /comments
      USAGE:
        Add a comment to a post
      PARAMS:
        id: UUID
        body: String
        author: String
        postId: Should match a post id in the database
        parentId: Should match a comment id in the database

    GET /comments/:id
      USAGE:
        Get the details for a single comment
      PARAMS:
        id: String

    PUT /comments/:id/:author/edit
      USAGE:
        Edit the details of an existing comment
      PARAMS:
        id: String
        author: String
      BODY:
        body: String

    DELETE /comments/:id/:author/:delete
      USAGE:
        Sets a comment's deleted flag to 'true'
      PARAMS:
        id: String
        author: String
        delete: String - "delete" or "restore"

    GET /user/:userId/profile
      USAGE:
        Gets the details for a user profile
      PARAMS:
        userId: String

    POST /user/:userId/login
      USAGE:
        Logs in a user and sends back a sessionToken
      PARAMS:
        userId: String
      BODY:
        password: String

    POST /user/:userId/signup
      USAGE:
        Creates a new user account
      PARAMS:
        userId: String
        password: String

    GET /user/:userId/posts
      USAGE:
        Get posts by user
      PARAMS:
        userId: String

    GET /user/:userId/comments
      USAGE:
        Get comments by user
      PARAMS:
        userId: String
 </pre>
  `

  res.send(help);
});

app.use((req, res, next) => {
  const sessionToken = req.get('sessionToken');
  if (sessionToken) req.sessionToken = sessionToken;
  next();
});

const serverErrorMsg = 'An error occurred on our part.';
const authErrorMsg = 'Log in to perform this action.';

const defaultError = { 500: serverErrorMsg };

/**
 * @description Get all (matching) categories
 */
app.get('/categories/get/:query*?', async(req, res) => {
  const errors = { 500: serverErrorMsg };
  const errorFn = handleErrorFn(res, errors);
  try {
    const data = await categories.getAll(pool, req.params.query);
    if (data.error) {
      errorFn(data.error);
    } else {
      res.send(data);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Get a specific category
 */
app.get('/categories/category/:category', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  try {
    const data = await categories.get(pool, req.params.category);
    if (data.error) {
      errorFn(data.error);
    } else {
      res.send(data);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

app.post('/categories/create', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  errors[403] = 'Category exists';
  const errorFn = handleErrorFn(res, errors);
  try {
    const client = await pool.getClient();
    const verified = verifySessionToken(req.sessionToken, req.body.user);
    if (!verified) {
      errorFn(401);
      return;
    }
    const result = await categories.create(client, req.body);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Get (matching) categories names
 */
app.get('/categories/suggestions/:query*?', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const data = await categories.getAll(pool, req.params.query, true);
  if (data.error) {
    errorFn(data.error);
  } else {
    const categories = data.map(cat => cat.name);
    res.send(categories);
  }
});

/**
 * @description Get posts for a category
 */
app.get('/categories/category/:category/posts/:query*?', async(req, res) => {
  const errors = clone(defaultError);
  errors[403] = 'Category does not exist';
  const errorFn = handleErrorFn(res, errors);
  const { criterion, offset, limit, direction } = req.headers;
  const { category, query } = req.params;
  const data = await posts.getPosts(
    pool,
    { key: 'category', value: category },
    query,
    criterion,
    direction,
    offset,
    limit
  );
  if (data.error) {
    errorFn(data.error);
  } else {
    res.send(data);
  }
});

/**
 * @description Subscribe to a category
 */
app.put('/categories/subscribe/:category/:update', async(req, res) => {
  const errors = clone(defaultError);
  errors[403] = 'Subscription update failed.';
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const verified = verifySessionToken(req.sessionToken, req.body.userId);
  if (!verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const subscribeResult = await categories.subscribe(client, req.params, req.body);
    if (subscribeResult.error) {
      errorFn(subscribeResult.error);
    } else {
      res.send(subscribeResult);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);    
  }
});

/**
 * @description Get all posts
 */
app.get('/posts/get/:query*?', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const { criterion, offset, limit, direction } = req.headers;
  const data = await posts.getPosts(
    pool,
    null,
    req.params.query,
    criterion,
    direction,
    offset,
    limit
  );
  if (data.error) {
    errorFn(500);
  } else {
    res.send(data);
  }
});

/**
 * @description Get a specific post
 */
app.get('/posts/thread/:id', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const data = await posts.get(pool, req.params.id);
  if (data.error) {
    errorFn(500);
  } else {
    res.send(data);
  }
});

/**
 * @description Add a post
 */
app.post('/posts', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const badRequestError = 'Bad request.';
  errors[403.1] = `${badRequestError} Category does not exist.`;
  const errorFn = handleErrorFn(res, errors);
  const verified = verifySessionToken(req.sessionToken, req.body.author);
  if (!verified) {
    errorFn(401);
    return;
  }
  let client;
  try {
    client = await pool.getClient();
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
  const result = await posts.add(client, req.body);
  if (!result || result.error) {
    errorFn(result ? result.error : 500);
  } else {
    res.send(result);
  }
});

/**
 * @description Edit a post
 */
app.put('/posts/thread/:id/:author/edit', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const verified = verifySessionToken(req.sessionToken, req.params.author);
  if (!verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const result = await posts.edit(client, req.params.id, req.body);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Delete a post
 */
app.delete('/posts/thread/:id/:author/:delete', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const { user } = req.headers;
  const verified = verifySessionToken(req.sessionToken, user);
  if (user !== req.params.author && !verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const result = await posts.deletePost(client, req.params);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Get post comments
 */
app.get('/posts/thread/:id/comments', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const { criterion, offset, limit, direction } = req.headers;
  const data = await comments.getComments(
    pool,
    { key: 'post_id', value: req.params.id },
    criterion,
    direction,
    false,
    offset,
    limit
  );
  if (data.error) {
    errorFn(data.error);
  } else {
    res.send(data);
  }
});

/**
 * @description Get a specific comment lineage
 */
app.get('/comments/:id/:descendantsOnly*?', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const { offset, limit } = req.headers;
  const data = await comments.getComments(
    pool,
    { key: 'comment_id', value: req.params.id },
    'best',
    'desc',
    req.params.descendantsOnly === 'children',
    offset,
    limit,
  );
  if (data.error) {
    errorFn(data.error);
  } else {
    res.send(data);
  }
});

/*
 * @description Add a new comment
 */
app.post('/comments', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const verified = verifySessionToken(req.sessionToken, req.body.author);
  if (!verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const result = await comments.add(client, req.body);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Edit a specific comment
 */
app.put('/comments/:id/:author/edit', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const verified = verifySessionToken(req.sessionToken, req.params.author);
  if (!verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const result = await comments.edit(client, req.params.id, req.body.body);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Delete a comment
 */
app.delete('/comments/:id/:author/:delete', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const { user } = req.headers;
  const verified = verifySessionToken(req.sessionToken, user);
  if (user !== req.params.author && !verified) {
    errorFn(401);
    return;
  }
  try {
    const client = await pool.getClient();
    const result = await comments.deleteComment(client, req.params.id, req.params.delete);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Vote on a post or comment
 */
app.put('/votes/:id/vote', async(req, res) => {
  const errors = clone(defaultError);
  errors[401] = authErrorMsg;
  const errorFn = handleErrorFn(res, errors);
  const { option, voterId } = req.body;
  const verified = verifySessionToken(req.sessionToken, voterId);
  if (!verified) {
    errorFn(401);
    return;
  }
  const target = req.params.id;
  // update record of voter
  try {
    const client = await pool.getClient();
    const result = await user.vote(client, voterId, target, option);
    if (result.error) {
      errorFn(result.error);
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Get a user profile
 */
app.get('/user/:userId/profile', async(req, res) => {
  const errors = clone(defaultError);
  errors[403] = 'User does not exist.';
  const errorFn = handleErrorFn(res, errors);
  const profileRes = await user.getProfile(pool, req.params.userId);
  if (profileRes.error) {
    errorFn(profileRes.error);
  } else {
    res.send(profileRes);
  }
});

/**
 * @description User login
 */
app.post('/user/:userId/login', async(req, res) => {
  const errors = clone(defaultError);
  errors[403.1] = 'User does not exist';
  errors[403.2] = 'Incorrect password';
  const errorFn = handleErrorFn(res, errors);
  try {
    const client = await pool.getClient();
    if (!client) errorFn(500);
    const userData = await user.login(client, req.params.userId, req.body.password);
    if (userData.error) {
      errorFn(userData.error);
    } else {
      res.send(userData);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Create a new user
 */
app.post('/user/:userId/signup', async(req, res) => {
  const errors = clone(defaultError);
  errors[403] = 'User already exists';
  const errorFn = handleErrorFn(res, errors);
  try {
    const client = await pool.getClient();
    if (!client) errorFn(500);
    const data = await user.create(client, req.params.userId, req.body);
    if (data.error) {
      errorFn(data.error);
    } else {
      res.send(data);
    }
  } catch (e) {
    console.error(e);
    errorFn(500);
  }
});

/**
 * @description Get posts by user
 */
app.get('/user/:userId/posts', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const { criterion, offset, limit, direction } = req.headers;
  // get posts by user
  const data = await posts.getPosts(
    pool,
    { key: 'posts.author', value: req.params.userId },
    null,
    criterion,
    direction,
    offset,
    limit
  );
  if (data.error) {
    errorFn(data.error);
  } else {
    res.send(data);
  }
});

/**
 * @description Get comments by user
 */
app.get('/user/:userId/comments', async(req, res) => {
  const errors = clone(defaultError);
  const errorFn = handleErrorFn(res, errors);
  const { criterion, direction, offset, limit } = req.headers;
  // get comment ids by user
  const data = await comments.getUserComments(
    pool,
    req.params.userId,
    criterion,
    direction,
    offset,
    limit
  );
  if (data.error) {
    errorFn(500);
  } else {
    res.send(data);
  }
});

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
});
