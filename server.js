require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const config = require('./config');
const categories = require('./categories');
const posts = require('./posts');
const comments = require('./comments');
const user = require('./user');
const { handleErrorFn } = require('./utils');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(multer().single());


app.get('/', (req, res) => {
  const help = `
  <pre>
    Welcome to the Udacity Readable API!

    Use an Authorization header to work with your own data:

    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})

    The following endpoints are available:

    GET /categories
      USAGE: 
        Get all of the categories available for the app. List is found in categories.js.
        Feel free to extend this list as you desire.
    
    GET /categories/:category/posts
      USAGE:
        Get all of the posts for a particular category

    GET /posts
      USAGE:
        Get all of the posts. Useful for the main page when no category is selected.
    
    POST /posts
      USAGE:
        Add a new post
      
      PARAMS: 
        id - UUID should be fine, but any unique id will work
        timestamp - timestamp in whatever format you like, you can use Date.now() if you like
        title - String
        body - String
        author - String
        category: Any of the categories listed in categories.js. Feel free to extend this list as you desire.

    GET /posts/:id
      USAGE:
        Get the details of a single post

    PUT /posts/:id/vote
      USAGE:
        Used for voting on a post
      PARAMS:
        option - String: Either "upVote" or "downVote"
        
    PUT /posts/:id/edit
      USAGE:
        Edit the details of an existing post
      PARAMS:
        title - String
        body - String

    DELETE /posts/:id
      USAGE:
        Sets the deleted flag for a post to 'true'. 
        Sets the parentDeleted flag for all child comments to 'true'.

    GET /posts/:id/comments
      USAGE:
        Get all the comments for a single post
    
    POST /comments
      USAGE:
        Add a comment to a post

      PARAMS:
        id: Any unique ID. As with posts, UUID is probably the best here.
        timestamp: timestamp. Get this however you want.
        body: String
        author: String
        postId: Should match a post id in the database.
        parentId: Should match a post id in the database
        ancestorId: Should match a comment id

    GET /comments/:id
      USAGE:
        Get the details for a single comment

    PUT /comments/:id/vote
      USAGE:
        Used for voting on a comment.

    PUT /comments/:id
      USAGE:
        Edit the details of an existing comment
     
      PARAMS:
        timestamp: timestamp.
        body: String

    DELETE /comments/:id
      USAGE:
        Sets a comment's deleted flag to 'true'

    GET /user/:userId/profile
      USAGE:
        Gets the details for a user profile

    POST /user/:userId/login
      USAGE:
        Logs in a user and sends back a sessionToken

      PARAMS:
        password: String

    POST /user/:userId/signup
      USAGE:
        Creates a new user account

      PARAMS:
        timestamp: timestamp.
        userId: String
        password: String

    PUT /user/:userId/update
      USAGE:
        Updates user details

      PARAMS:
        body: details to update
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

/**
 * @description Get all (matching) categories
 */
app.get('/categories/get/:query*?', (req, res) => {
  const errors = { 500: serverErrorMsg };
  categories.getAll(req.params.query)
  .then(
    (data) => res.send(data),
    handleErrorFn(res, errors)
  );
});

/**
 * @description Get posts for a category
 */
app.get('/categories/category/:category/posts/:query*?', (req, res) => {
  const errors = { 500: serverErrorMsg };
  categories.getCategoryPosts(req.params.category)
    .then(
      postIds => posts.getByIds(postIds, req.params.query).then(
        (data) => res.send(data),
        handleErrorFn(res, errors)
      ),
      handleErrorFn(res, errors)
    );
});

/**
 * @description Get all posts
 */
app.get('/posts/get/:query*?', (req, res) => {
  const errors = { 500: serverErrorMsg };
  posts.getAll(req.params.query)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/**
 * @description Get a specific post
 */
app.get('/posts/thread/:id', (req, res) => {
  const errors = { 500: serverErrorMsg };
  posts.get(req.params.id)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/**
 * @description Add a post
 */
app.post('/posts', (req, res) => {
    if (!req.sessionToken) {
      res.status(401).send({ error: authErrorMsg });
    } else {
      const errors = { 500: serverErrorMsg, 401: authErrorMsg };
      posts.add(req.sessionToken, req.body)
        .then(
          (data) => {
            // record new post in user profile
            user.addPost(data.author, data.id);
            // add post to category
            categories.addPost(data.category,   data.id);
            // add default upvote from author
            user.writeUserVote(data.author, data.id, 'upVote');
            res.send(data);
          },
          handleErrorFn(res, errors)
        );
    }
});

/**
 * @description Delete a post
 */
app.delete('/posts/thread/:id/delete', (req, res) => {
    if (!req.sessionToken) {
      res.status(401).send({ error: authErrorMsg });
    } else {
      const errors = { 500: serverErrorMsg, 401: authErrorMsg };
      const { userId } = req.body;
      posts.disable(req.sessionToken, req.params.id, userId)
        .then((post) =>
          comments.disableByPost(post)
        ).then(
          (data) => {
            user.removePost(data.author, data.id);
            res.send(data)
          },
          handleErrorFn(res, errors)
        );
    }
});

/**
 * @description Vote on a post
 */
app.put('/posts/thread/:id/vote', (req, res) => {
  if (!req.sessionToken) {
    res.status(401).send({ error: authErrorMsg });
  } else {
    const errors = { 500: serverErrorMsg, 401: authErrorMsg, 403: 'Duplicated vote.' };
    const { option, voterId } = req.body;
    const voteId = req.params.id;
    // update record of voter
    user.updateUserVote(req.sessionToken, voterId, voteId, option)
      .then((updatedOption, oldOption) => {
        posts.vote(voteId, updatedOption, oldOption)
          .then(
            (data) => {
              // update post score of post author
              user.updatePostScore(data.author, updatedOption, oldOption);
              res.send({});
            },
            handleErrorFn(res, errors)
          );
      }, handleErrorFn(res, errors));
  }
});

/**
 * @description Edit a post
 */
app.put('/posts/thread/:id/edit', (req, res) => {
  if (!req.sessionToken) {
    res.status(401).send({ error: authErrorMsg });
  } else {
    const errors = { 500: serverErrorMsg, 401: authErrorMsg };
    posts.edit(req.sessionToken, req.params.id, req.body)
      .then(
        (data) => res.send(data),
        handleErrorFn(res, errors)
      );
  }
});

/**
 * @description Get all post comments
 */
app.get('/posts/thread/:id/comments', (req, res) => {
  const errors = { 500: serverErrorMsg };
  comments.getByParent(req.params.id)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/**
 * @description Get a specific comment
 */
app.get('/comments/:id', (req, res) => {
  const errors = { 500: serverErrorMsg, 401: authErrorMsg };
  comments.get(req.params.id)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/*
 * @description Add a new comment
 */
app.post('/comments', (req, res) => {
  if (!req.sessionToken) {
    res.status(401).send({ error: authErrorMsg });
  } else {
    const errors = { 500: serverErrorMsg, 401: authErrorMsg }
    comments.add(req.sessionToken, req.body)
      .then(
        (data) => {
          // record new post in user profile
          user.addComment(data.author, data.id);
          // add default upvote from author
          user.writeUserVote(data.author, data.id, 'upVote');
          res.send(data);
        },
        handleErrorFn(res, errors)
      );
  }
});

/**
 * @description Edit a specific comment
 */
app.put('/comments/:id/edit', (req, res) => {
  if (!req.sessionToken) {
    res.status(401).send({ error: authErrorMsg });
  } else {
    const errors = { 500: serverErrorMsg, 401: authErrorMsg };
    comments.edit(req.sessionToken, req.params.id, req.body)
      .then(
        (data) => res.send(data),
        handleErrorFn(res, errors)
      );
  }
});

/**
 * @description Vote on a comment
 */
app.put('/comments/:id/vote', (req, res) => {
  if (!req.sessionToken) {
    res.status(401).send({ error: authErrorMsg });
  } else {
    const errors = { 500: serverErrorMsg, 401: authErrorMsg, 403: 'Duplicated vote.' };
    const voteId = req.params.id;
    const { option, voterId } = req.body;
    // update record of voter
    user.updateUserVote(req.sessionToken, voterId, voteId, option)
      .then((updatedOption, oldOption) => {
        // use the resulting vote option
        comments.vote(voteId, updatedOption)
          .then(
            (data) => {
              // update comment score of author
              user.updateCommentScore(data.author, updatedOption);
              res.send({});
            },
            handleErrorFn(res, errors)
          );
      }, handleErrorFn(res, errors));
  }
});

/**
 * @description Delete a specific comment
 */
app.delete('/comments/:id', (req, res) => {
    if (!req.sessionToken) {
      res.status(401).send({ error: authErrorMsg });
    } else {
      const errors = { 500: serverErrorMsg, 401: authErrorMsg };
      comments.disable(req.sessionToken, req.params.id)
        .then(
          (data) => {
            user.removeComment(data.author, data.id);
            res.send(data);
          },
          handleErrorFn(res, errors)
        );
    }
});

/**
 * @description Get a user profile
 */
app.get('/user/:userId/profile', (req, res) => {
  const errors = { 500: serverErrorMsg, 403: 'User does not exist.' };
  user.getProfile(req.params.userId)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/**
 * @description Check if a username is available
 */
app.get('/user/:userId/check', (req, res) => {
  const errors = { 403: 'User already exists.', 500: serverErrorMsg };
  user.checkUserExists(req.params.userId)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors)
    );
});

/**
 * @description User login
 */
app.post('/user/:userId/login', (req, res) => {
  const errors = { 403: 'Incorrect password.', 500: serverErrorMsg };
  user.login(req.params.userId, req.body.password)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors));
});

/**
 * @description Create a new user
 */
app.post('/user/:userId/signup', (req, res) => {
  const errors = { 403: 'User already exists.', 500: 'An error occurred on our part.' };
  user.create(req.params.userId, req.body)
    .then(
      (data) => res.send(data),
      handleErrorFn(res, errors));
});

/**
 * @description Update user fields
 */
app.put('/user/:userId/update', (req, res) => {
    if (!req.sessionToken) {
      res.status(401).send({ error: authErrorMsg });
    } else {
      const errors = { 500: serverErrorMsg, 401: authErrorMsg };
      user.update(req.sessionToken, req.params.userId, req.body)
        .then(
          data => res.send(data),
          handleErrorFn(res, errors)
        );
    }
});

/**
 * @description Get posts by user
 */
app.get('/user/:userId/history', (req, res) => {
  const results = { posts: null, comments: null };
  // get post ids by user
  user.getPosts(req.params.userId).then(postIds => {
    // get post data by post ids
    posts.getByIds(postIds).then((userPosts) => {
      results.posts = userPosts;
      // get comment ids by user
      user.getComments(req.params.userId)
        .then((commentIds) => {
          // get comment data by comment ids
          comments.getByIds(commentIds)
            .then((userComments) => {
              results.comments = userComments;
              // send results
              res.send(results);
            });
        });
    });
  })
  .catch(err => res.send({ error: serverErrorMsg }));
});

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
});
