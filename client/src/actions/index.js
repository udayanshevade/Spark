import * as responsive from './responsive';
import * as navbar from './navbar';
import * as categories from './categories';
import * as user from './user';
import * as profile from './profile';
import * as posts from './posts';
import * as search from './search';
import * as post from './post';

module.exports = {
  ...responsive,
  ...navbar,
  ...categories,
  ...user,
  ...profile,
  ...posts,
  ...search,
  ...post,
};
