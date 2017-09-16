import * as types from '../actions/types';

export const initialState = {
  data: null,
  comments: [],
  loading: false,
  criteria: [{
    label: 'New',
    value: 'timestamp',
    direction: 'desc'
  }, {
    label: 'Score',
    value: 'voteScore',
    direction: 'desc',
  }],
  selectedCriterion: 'timestamp',
  sortDirection: 'desc',
  showFull: false,
  bodyCharLimt: 90,
};

const post = (state = initialState, action) => {
  switch (action.type) {
    case types.POST_SET_LOADING: {
      const { loading } = action;
      return { ...state, loading };
    }
    case types.POST_UPDATE_DATA: {
      const { data } = action;
      return { ...state, data };
    }
    case types.POST_UPDATE_COMMENTS: {
      const { comments } = action;
      return { ...state, comments };
    }
    case types.POST_COMMENTS_UPDATE_SORT_CRITERION: {
      const { selectedCriterion } = action;
      return { ...state, selectedCriterion };
    }
    case types.POST_COMMENTS_UPDATE_SORT_DIRECTION: {
      const { sortDirection } = action;
      return { ...state, sortDirection };
    }
    case types.POST_TOGGLE_SHOW_FULL: {
      const showFull = !state.showFull;
      return { ...state, showFull };
    }
    case types.POST_EMPTY:
      return initialState;
    default:
      return state;
  }
};

export default post;
