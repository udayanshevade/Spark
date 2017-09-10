import * as types from '../actions/types';

export const initialState = {
  filters: ['topics', 'posts'],
  activeFilter: 0,
  query: '',
};

const search = (state = initialState, action) => {
  switch(action.type) {
    case types.SEARCH_QUERY_UPDATE: {
      const { query } = action;
      return {
        ...state,
        query,
      };
    }
    case types.SEARCH_FILTER_UPDATE: {
      const { activeFilter } = action;
      return {
        ...state,
        activeFilter,
      };
    }
    default:
      return state;
  }
};

export default search;
