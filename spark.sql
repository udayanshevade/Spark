CREATE TABLE users (
  user_id text PRIMARY KEY,
  session_token text,
  email text,
  password text,
  created integer);

CREATE TABLE categories (
  name text PRIMARY KEY,
  creator text,
  private boolean,
  blurb text);

CREATE TABLE posts (
  post_id text PRIMARY KEY,
  title text,
  timestamp integer,
  url text,
  body text,
  author text references users (user_id),
  deleted boolean);

CREATE TABLE category_posts (
  category text references categories (name),
  post_id text references posts);

CREATE TABLE comments (
  comment_id text PRIMARY KEY,
  timestamp integer,
  body text,
  author text references users (user_id),
  root boolean,
  deleted boolean);

CREATE TABLE post_comments (
  post_id text references posts,
  comment_id text references comments);

CREATE TABLE comment_children (
  comment_id text references comments,
  child_id text references comments (comment_id));

CREATE TABLE votes (
  user_id text references users,
  target text,
  vote text);