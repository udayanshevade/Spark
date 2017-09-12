import * as types from '../actions/types';

export const initialState = {
  filters: ['categories', 'posts'],
  criteria: [{
    label: 'Relevance',
    value: 'relevance',
    direction: 'asc',
  }, {
    label: 'New',
    value: 'timestamp',
    direction: 'desc'
  }, {
    label: 'Score',
    value: 'voteScore',
    direction: 'desc',
  }],
  sortDirection: 'desc',
  selectedCriterion: 'relevance',
  activeFilter: 1,
  timeoutId: null,
  timeoutLength: 750,
};

const search = (state = initialState, action) => {
  switch(action.type) {
    case types.SEARCH_FILTER_UPDATE: {
      const { activeFilter } = action;
      return { ...state, activeFilter };
    }
    case types.SEARCH_SET_TIMEOUT: {
      const { timeoutId } = action;
      return { ...state, timeoutId };
    }
    case types.SEARCH_UPDATE_SORT_CRITERION: {
      const { selectedCriterion } = action;
      return { ...state, selectedCriterion };
    }
    case types.SEARCH_UPDATE_SORT_DIRECTION: {
      const { sortDirection } = action;
      return { ...state, sortDirection };
    }
    default:
      return state;
  }
};

export default search;