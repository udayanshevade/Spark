import * as types from './types';
import {
  categoriesLoadData,
  categoriesQueryUpdate,
  categoriesUpdate,
  categoriesUpdateOffset,
} from './categories';
import {
  postsUpdate,
  postsUpdateOffset,
  postsLoadData,
  postsQueryUpdate,
} from './posts';

export const searchQueryChange = (e, category) => (dispatch, getState) => {
  const query = e.target.value;
  const { search, posts, categories } = getState();
  const {
    filters,
    activeFilter,
    timeoutId,
    timeoutLength,
  } = search;
  const filter = filters[activeFilter];
  // update query string
  dispatch(searchQueryUpdate(filter, query));
  // clear prior timeout if still typing
  clearTimeout(timeoutId);
  // assign a new timeout
  const newTimeoutId = setTimeout(() => {
    // load appropriate data
    if (filter === 'categories') {
      const { query: prevQuery } = categories;
      if (query !== prevQuery) {
        dispatch(categoriesUpdate([]));
        dispatch(categoriesUpdateOffset(0));
      }
      dispatch(categoriesLoadData(query));
    } else {
      const { query: prevQuery } = posts;
      if (query !== prevQuery) {
        dispatch(postsUpdate([]));
        dispatch(postsUpdateOffset(0));
      }
      if (query) {
        dispatch(searchUpdateSortCriterion('relevance'));
      } else {
        dispatch(searchUpdateSortCriterion('hot'));
      }
      dispatch(postsLoadData(query, category));
    }
  }, timeoutLength);
  dispatch(searchSetTimeout(newTimeoutId));
};

export const searchSetTimeout = timeoutId => ({
  type: types.SEARCH_SET_TIMEOUT,
  timeoutId,
});

export const searchQueryUpdate = (filter, query) => (dispatch) => {
  if (filter === 'categories') {
    dispatch(categoriesQueryUpdate(query));
  } else {
    dispatch(postsQueryUpdate(query));
  }
};

export const searchFilterUpdate = activeFilter => ({
  type: types.SEARCH_FILTER_UPDATE,
  activeFilter,
});

export const searchSelectSortCriterion = ({ value, direction }, category) => (dispatch, getState) => {
  const { search, posts } = getState();
  const { selectedCriterion, sortDirection } = search;
  const { query } = posts;
  if (selectedCriterion !== value) {
    dispatch(searchUpdateSortCriterion(value));
  }
  if (sortDirection !== direction) {
    dispatch(searchUpdateSortDirection(direction));
  }
  dispatch(postsUpdate([]));
  dispatch(postsUpdateOffset(0));
  dispatch(postsLoadData(query, category));
};

export const searchUpdateSortCriterion = selectedCriterion => ({
  type: types.SEARCH_UPDATE_SORT_CRITERION,
  selectedCriterion,
});

export const searchUpdateSortDirection = sortDirection => ({
  type: types.SEARCH_UPDATE_SORT_DIRECTION,
  sortDirection,
});
