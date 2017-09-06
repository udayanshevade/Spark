import { combineReducers } from 'redux';
import categories, { initialState as categoriesState } from './categories';

export const initialState = {
  categories: categoriesState,
};

export default combineReducers({
  categories,
});
