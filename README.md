# Content aggregator API Server

Setup:

- Install [Vagrant](https://www.vagrantup.com/docs/installation/) and [VirtualBox](https://www.virtualbox.org/)
- Navigate to project directory and run `vagrant up` followed by `vagrant ssh`
 - Note: if you are using Windows, make sure to run Git Bash as Administrator
- Run aliased command `server` to serve backend
- In a separate terminal, run `vagrant up` and `vagrant ssh`
- Run aliased command `client` to serve frontend
- Open localhost:3000 in a browser

## Installation
Install packages: `npm install`
Launch server: `node server`
Unless modified in `config.js` server will use port 5001


## API
The following endpoints are available:  

  `GET /categories/get/:query*?`
    **USAGE:**
      Get data for categories.
    **PARAMS:**
      query: String - optional filter

  `GET /categories/suggestions/:query*?`
    **USAGE:**
      Get category names only.
    **PARAMS:**
      query: String

  `GET /categories/category/:category`
    **USAGE:**
      Get data for single, specific category.
    **PARAMS:**
      category: String

  `GET /categories/category/:category/posts/:query*?`
    **USAGE:**
      Get posts for a given category
    **PARAMS:**
      query: optional filter

  `POST /categories/create`
    **USAGE:**
      Create a category.
    **BODY:**
      name: String - category name
      body: String - description

  `POST /categories/subscribe/:category/:update`
    **USAGE:**
      Updates a user subscription for a given category.
    **PARAMS:**
      category: String
      update: String - "unsubscribe" or "subscribe"

  `GET /posts/get/:query*?`
    **USAGE:**
      Get data for all posts. Optional query to filter.
    **PARAMS:**
      query: String - optional filter

  `GET /posts/thread/:id`
    **USAGE:**
      Get the details of a single post
    **PARAMS:**
      id: String

  `POST /posts`
    **USAGE:**
      Add a new post
    **PARAMS:** 
      id: UUID
      title: String
      body: String
      author: String
      category: String

  `PUT /votes/:id/vote`
    **USAGE:**
      Vote on a post
    **PARAMS:**
      id: String - id of the target
    **BODY:**
      voterId: String - id of the user
      option: String - can be "upVote", "downVote" or null

  `PUT /posts/thread/:id/:author/edit`
    **USAGE:**
      Edit the details of an existing post
    **PARAMS:**
      id: String - id of the post
      author: String - id of the poster
    **BODY:**
      title: String
      body: String
      url: String
      category: String

  `DELETE /posts/thread/:id/:author/:delete`
    **USAGE:**
      Sets the deleted value for a post to 'true'. 
      The post becomes accessible.
    **PARAMS:**
      id: String
      author: String
      delete: String - option to delete / restore

  `GET /posts/thread/:id/comments`
    **USAGE:**
      Get all the comments for a single post
    **PARAMS:**
      id: String

  `GET /comments/:id/:descendantsOnly*`
    **USAGE:**
      Get all comments in a specific comment chain
    **PARAMS:**
      descendantsOnly - determines whether to exclude topmost comment

  `POST /comments`
    **USAGE:**
      Add a comment to a post
    **PARAMS:**
      id: UUID
      body: String
      author: String
      postId: Should match a post id in the database
      parentId: Should match a comment id in the database

  `GET /comments/:id`
    **USAGE:**
      Get the details for a single comment
    **PARAMS:**
      id: String

  `PUT /comments/:id/:author/edit`
    **USAGE:**
      Edit the details of an existing comment
    **PARAMS:**
      id: String
      author: String
    **BODY:**
      body: String

  `DELETE /comments/:id/:author/:delete`
    **USAGE:**
      Sets a comment's deleted flag to 'true'
    **PARAMS:**
      id: String
      author: String
      delete: String - "delete" or "restore"

  `GET /user/:userId/profile`
    **USAGE:**
      Gets the details for a user profile
    **PARAMS:**
      userId: String

  `POST /user/:userId/login`
    **USAGE:**
      Logs in a user and sends back a sessionToken
    **PARAMS:**
      userId: String
    **BODY:**
      password: String

  `POST /user/:userId/signup`
    **USAGE:**
      Creates a new user account
    **PARAMS:**
      userId: String
        password: String

  `GET /user/:userId/posts`
    **USAGE:**
      Get posts by user
    **PARAMS:**
      userId: String

  `GET /user/:userId/comments`
    **USAGE:**
      Get comments by user
    **PARAMS:**
      userId: String