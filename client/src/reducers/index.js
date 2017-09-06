import { combineReducers } from 'redux';
import responsive, { initialState as responsiveState } from './responsive';
import navbar, { initialState as navbarState } from './navbar';
import categories, { initialState as categoriesState } from './categories';
import user, { initialState as userState } from './user';

export const initialState = {
  responsive: responsiveState,
  navbar: navbarState,
  categories: categoriesState,
  user: userState,
};

export default combineReducers({
  responsive,
  navbar,
  categories,
  user,
});
