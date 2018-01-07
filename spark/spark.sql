CREATE TABLE users (
  user_id text PRIMARY KEY,
  password text,
  session_token text,
  email text DEFAULT NULL,
  created timestamptz NOT NULL DEFAULT now());

CREATE TABLE categories (
  name text PRIMARY KEY,
  creator text,
  blurb text DEFAULT NULL,
  private boolean NOT NULL DEFAULT false);

CREATE TABLE category_subscriptions (
  category text references categories (name),
  user_id text references users);

CREATE TABLE posts (
  post_id text PRIMARY KEY,
  title text,
  url text,
  body text,
  category text references categories (name),
  author text references users (user_id),
  created timestamptz NOT NULL DEFAULT now(),
  deleted boolean NOT NULL DEFAULT false);

CREATE TABLE comments (
  comment_id text PRIMARY KEY,
  parent_id text references comments (comment_id) DEFAULT NULL,
  post_id text references posts,
  body text,
  author text references users (user_id),
  created timestamptz NOT NULL DEFAULT now(),
  deleted boolean NOT NULL DEFAULT false);

CREATE TABLE votes (
  voter_id text references users (user_id),
  target_id text,
  vote text,
  PRIMARY KEY (voter_id, target_id));