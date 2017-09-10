import * as types from './types';

export const searchQueryChange = e => dispatch => {
  const { value } = e.target;
  dispatch(searchQueryUpdate(value));
};

export const searchQueryUpdate = query => ({
  type: types.SEARCH_QUERY_UPDATE,
  query,
});

export const searchFilterUpdate = activeFilter => ({
  type: types.SEARCH_FILTER_UPDATE,
  activeFilter,
});
