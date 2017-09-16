import * as types from './types';
import { categoriesLoadData, categoriesQueryUpdate } from './categories';
import { postsLoadData, postsQueryUpdate } from './posts';

export const searchQueryChange = (e, category) => (dispatch, getState) => {
  const query = e.target.value;
  const { search } = getState();
  const { filters, activeFilter, timeoutId, timeoutLength } = search;
  const filter = filters[activeFilter];
  // update query string
  dispatch(searchQueryUpdate(filter, query));
  // clear prior timeout if still typing
  clearTimeout(timeoutId);
  // assign a new timeout
  const newTimeoutId = setTimeout(() => {
    // load appropriate data
    if (filter === 'categories') {
      dispatch(categoriesLoadData(query));
    } else {
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

export const searchSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { search } = getState();
  const { selectedCriterion, sortDirection } = search;
  if (selectedCriterion !== value) {
    dispatch(searchUpdateSortCriterion(value));
  }
  if (sortDirection !== direction) {
    dispatch(searchUpdateSortDirection(direction));
  }
};

export const searchUpdateSortCriterion = selectedCriterion => ({
  type: types.SEARCH_UPDATE_SORT_CRITERION,
  selectedCriterion,
});

export const searchUpdateSortDirection = sortDirection => ({
  type: types.SEARCH_UPDATE_SORT_DIRECTION,
  sortDirection,
});
