import * as types from '../actions/types';

export const initialState = {
  data: null,
  comments: [],
  loading: true,
  creating: false,
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
  bodyCharLim: 90,
  categorySuggestions: {
    results: [],
    timeoutId: null,
    timeoutLength: 750,
  },
  createData: {
    title: '',
    url: '',
    body: '',
    category: '',
  },
};

const post = (state = initialState, action) => {
  switch (action.type) {
    case types.POST_SET_LOADING: {
      const { loading } = action;
      return { ...state, loading };
    }
    case types.POST_SET_CREATING: {
      const { creating } = action;
      return { ...state, creating };
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
    case types.USER_UPDATE_VOTES: {
      const { id, option, previousVote, target } = action;
      if (!state.data ||
        (previousVote && previousVote === option)
      ) { return state; }
      switch (target) {
        case 'posts': {
          const votes = { ...state.data.votes };
          if (option) {
            votes[option] += 1;
          }
          if (previousVote && previousVote !== option) {
            votes[previousVote] -= 1;
          }
          return {
            ...state,
            data: {
              ...state.data,
              votes,
            },
          };
        }
        case 'comments': {
          if (!state.comments.length) return state;
          const comments = [...state.comments];
          const oldIndex = comments.findIndex(item => item.id === id);
          if (oldIndex < 0) return state;
          const oldItem = comments[oldIndex];
          const votes = { ...oldItem.votes };
          if (option) {
            votes[option] += 1;
          } else if (previousVote && previousVote !== option) {
            votes[previousVote] -= 1;
          }
          const newItem = { ...oldItem, votes };
          comments.splice(oldIndex, 1, newItem);
          return { ...state, comments };
        }
        default:
          return state;
      }
    }
    case types.POST_UPDATE_CATEGORY_SUGGESTIONS: {
      const { results } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          results,
        },
      };
    }
    case types.POST_CATEGORIES_SET_TIMEOUT: {
      const { timeoutId } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          timeoutId,
        },
      };
    }
    case types.POST_UPDATE_CREATE_DATA: {
      const { createData } = action;
      return {
        ...state,
        createData: {
          ...state.createData,
          ...createData,
        },
      };
    }
    case types.POST_EDIT_DATA: {
      const { postId, vals } = action;
      if (state.data && state.data.id === postId) {
        const data = { ...state.data };
        Object.keys(vals).forEach((val) => {
          data[val] = vals[val];
        });
        return {
          ...state,
          data,
        };
      }
      return state;
    }
    case types.POST_EMPTY:
      return {
        ...initialState,
        createData: state.createData,
      };
    default:
      return state;
  }
};

export default post;
