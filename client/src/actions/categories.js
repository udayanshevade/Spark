import * as types from './types';

export const categoriesSetLoading = loading => ({
  type: types.CATEGORIES_SET_LOADING,
  loading,
});

export const categoriesUpdate = categories => ({
  type: types.CATEGORIES_UPDATE,
  categories,
});

export const categoriesSetActive = active => ({
  type: types.CATEGORIES_SET_ACTIVE,
  active,
});
