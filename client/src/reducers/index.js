import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import responsive, { initialState as responsiveState } from './responsive';
import app, { initialState as appState } from './app';
import navbar, { initialState as navbarState } from './navbar';
import categories, { initialState as categoriesState } from './categories';
import posts, { initialState as postsState } from './posts';
import user, { initialState as userState } from './user';
import search, { initialState as searchState } from './search';
import profile, { initialState as profileState } from './profile';
import post, { initialState as postState } from './post';
import comment, { initialState as commentState } from './comment';

export const initialState = {
  responsive: responsiveState,
  app: appState,
  navbar: navbarState,
  categories: categoriesState,
  posts: postsState,
  user: userState,
  search: searchState,
  profile: profileState,
  post: postState,
  comment: commentState,
};

export default combineReducers({
  responsive,
  app,
  navbar,
  categories,
  posts,
  user,
  search,
  profile,
  post,
  comment,
  form: formReducer,
});
