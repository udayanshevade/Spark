# Content aggregator API Server

## Description:

Read and submit posts, comment and vote on content.

## Live preview:

Find the app [here](https://us-spark-aggregator.herokuapp.com/).

## Local setup:

- Install [Vagrant v1.9.2](https://releases.hashicorp.com/vagrant/?_ga=2.125817097.2010615457.1516220314-883805047.1513135144) and [VirtualBox v5.1.26](https://www.virtualbox.org/wiki/Changelog-5.1#v26)
  - Vagrant 2.x is not compatible at this time. Other versions of virtualbox may be compatible, but have not been tested.
- Navigate to project directory and run `vagrant up` followed by `vagrant ssh`
  - Note: if you are using Windows, you will **need** to run Bash as an Administrator.
- Run aliased command `dev` to install dependencies and serve project
- Open localhost:3000 in a browser

## Setup issues:

i. Make sure the Vagrant/Virtualbox versions match the ones specified above.

ii. If there is a problem installing dependencies while serving the project, try deleting and/or reinstalling the dependencies.

iii. For a mismatch in UIDs, try [this solution](https://stackoverflow.com/a/32256848/9059056). It is not an issue with Vagrant or the setup.

## App usage:

- Create user credential to persist changes in the app
  - Note: You must **log in** to access edit/delete functionality
  - You may only delete/edit posts and comments that belong to you
- Create categories, submit/comment on posts, and vote

## Deployment:

- Uses Heroku for deployment, with the postgresql addon for persisting database changes in production.

## Server API

The backend uses a custom server with the following endpoints:

| Endpoints | Usage | Params |
| --- | --- | --- |
| `GET /categories/get/:query*?` | Get data for categories. | - **query**: [String] - optional filter |
| `GET /categories/suggestions/:query*?` | Get category names only. | - **query**: [String] |
| `GET /categories/category/:category` | Get data for single, specific category. | - **category**: [String] |
| `GET /categories/category/:category/posts/:query*?` | Get posts for a given category | - **query**: optional filter |
| `POST /categories/create` | Create a category. | - **name**: [String] - category name <br> - **body**: [String] - description |
| `POST /categories/subscribe/:category/:update` | Updates a user subscription for a given category. | - **category**: [String] <br> - **update**: [String] - "unsubscribe" or "subscribe" |
| `GET /posts/get/:query*?` | Get data for all posts. | - **query**: [String] |
| `GET /posts/thread/:id` | Get the details of a single post | - **id**: [UUID] |
| `POST /posts` | Add a new post | - **id**: [UUID] <br> - **title**: [String] <br> - **body**: [String] <br> - **author**: [String] <br> - **category**: [String] |
| `PUT /votes/:id/vote` | Vote on a post | - **id**: [UUID] - id of the target <br> - **voterId**: [String] - id of the user <br> - **option**: [String] - can be "upVote", "downVote" or `null` |
|`PUT /posts/thread/:id/:author/edit` | Edit the details of an existing post | - **id**: [UUID] - id of the post <br> - **author**: [String] - id of the poster <br> - **title**: [String] <br> - **body**: [String] <br> - **url**: [String] <br> - **category**: [String] <br> |
| `DELETE /posts/thread/:id/:author/:delete` | Sets the deleted value for a post to 'true'. <br> The post becomes accessible. | - **id**: [UUID] <br> - **author**: [String] <br> - **delete**: [String] - option to delete / restore |
| `GET /posts/thread/:id/comments` | Get all the comments for a single post | - **id**: [UUID] |
| `GET /comments/:id/:descendantsOnly*` | Get all comments in a specific comment chain | - **descendantsOnly**: [String] - determines whether to exclude topmost comment |
| `POST /comments` | Add a comment to a post | - **id**: [UUID] <br> - **body**: [String] <br> - **author**: [String] <br> - **postId**: [UUID] Should match a post id in the database <br> - **parentId**: [UUID] Should match a comment id in the database |
| `GET /comments/:id` | Get the details for a single comment | - **id**: [String] |
| `PUT /comments/:id/:author/edit` | Edit the details of an existing comment | - **id**: [UUID] <br> - **author**: [String] <br> - **body**: [String] |
| `DELETE /comments/:id/:author/:delete` | Sets a comment's deleted flag to 'true' | - **id**: [UUID] <br> - **author**: [String] <br> - **delete**: [String] - "delete" or "restore" <br> |
| `GET /user/:userId/profile` | Gets the details for a user profile | - **userId**: [String] |
| `POST /user/:userId/login` | Logs in a user and sends back a sessionToken | - **userId**: [String] <br> - **password**: [String] |
| `POST /user/:userId/signup` | Creates a new user account | - **userId**: [String] <br> - **password**: [String] |
| `GET /user/:userId/posts` | Get posts by user | - **userId**: [String] |
| `GET /user/:userId/comments` | Get comments by user | - **userId**: [String] |