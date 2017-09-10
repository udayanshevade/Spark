import * as types from '../actions/types';

export const initialState = {
  filters: ['categories', 'posts'],
  activeFilter: 0,
  timeoutId: null,
  timeoutLength: 750,
};

const search = (state = initialState, action) => {
  switch(action.type) {
    case types.SEARCH_FILTER_UPDATE: {
      const { activeFilter } = action;
      return {
        ...state,
        activeFilter,
      };
    }
    case types.SEARCH_SET_TIMEOUT: {
      const { timeoutId } = action;
      return {
        ...state,
        timeoutId,
      };
    }
    default:
      return state;
  }
};

export default search;
