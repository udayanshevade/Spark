import * as types from './types';
import Requests from '../requests';

const categoriesURL = './categories';

export const categoriesQueryUpdate = query => ({
  type: types.CATEGORIES_QUERY_UPDATE,
  query,
});

export const categoriesSetLoading = loading => ({
  type: types.CATEGORIES_SET_LOADING,
  loading,
});

export const categoriesUpdate = categories => ({
  type: types.CATEGORIES_UPDATE,
  categories,
});

export const categoriesLoadData = (query = '') => async(dispatch) => {
  dispatch(categoriesSetLoading(true));
  const categories = await Requests.get(`${categoriesURL}/get/${query}`);
  dispatch(categoriesSetLoading(false));
  dispatch(categoriesUpdate(categories));
};

export const categoriesSetActive = active => ({
  type: types.CATEGORIES_SET_ACTIVE,
  active,
});
