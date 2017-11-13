import * as types from '../actions/types';

export const initialState = {
  username: '',
  user: null,
  posts: {
    posts: [],
    offset: 0,
    limit: 10,
    selectedCriterion: 'new',
    sortDirection: 'desc',
    loading: false,
  },
  comments: {
    comments: [],
    offset: 0,
    limit: 10,
    selectedCriterion: 'new',
    sortDirection: 'desc',
    loading: false,
  },
  sortCriteria: [{
    label: 'New',
    value: 'new',
    direction: 'desc'
  }, {
    label: 'Best',
    value: 'best',
    direction: 'desc',
  },{
    label: 'Score',
    value: 'score',
    direction: 'desc',
  }],
  previewActive: false,
  loading: false,
};

const profile = (state = initialState, action) => {
  switch(action.type) {
    case types.PROFILE_SET_USERNAME: {
      const { username } = action;
      return { ...state, username };
    }
    case types.PROFILE_SET_LOADING: {
      const { loading, affects } = action;
      if (!affects) {
        return { ...state, loading };
      } else {
        return {
          ...state,
          [affects]: {
            ...state[affects],
            loading,
          },
        };
      }
    }
    case types.PROFILE_UPDATE_DATA: {
      const { user } = action;
      return { ...state, user };
    }
    case types.PROFILE_UPDATE_POSTS: {
      const { posts } = action;
      const newState = { ...state };
      if (posts) newState.posts.posts = posts;
      return newState; 
    }
    case types.PROFILE_UPDATE_COMMENTS: {
      const { comments } = action;
      const newState = { ...state };
      if (comments) newState.comments.comments = comments;
      return newState;
    }
    case types.PROFILE_SET_PREVIEW_ACTIVE: {
      const { previewActive } = action;
      return { ...state, previewActive };
    }
    case types.PROFILE_UPDATE_SORT_CRITERION: {
      const { selectedCriterion, affects } = action;
      return {
        ...state,
        [affects]: {
          ...state[affects],
          selectedCriterion,
        },
      };
    }
    case types.PROFILE_UPDATE_SORT_DIRECTION: {
      const { sortDirection, affects } = action;
      return {
        ...state,
        [affects]: {
          ...state[affects],
          sortDirection,
        },
      };
    }
    case types.PROFILE_UPDATE_OFFSET: {
      const { offset, affects } = action;
      return {
        ...state,
        [affects]: {
          ...state[affects],
          offset,
        },
      };
    }
    case types.PROFILE_UPDATE_DEPLETED: {
      const { depleted, affects } = action;
      return {
        ...state,
        [affects]: {
          ...state[affects],
          depleted,
        }
      }
    }
    case types.PROFILE_RESET: {
      return initialState;
    }
    case types.USER_UPDATE_VOTES: {
      const { id, option, previousVote, target } = action;
      if (!previousVote && previousVote === option) {
        return state;
      }
      const items = [...state[target]];
      const oldIndex = items.findIndex(item => item.id === id);
      if (oldIndex < 0) return state;
      const oldItem = items[oldIndex];
      const votes = { ...oldItem.votes };
      if (option) {
        votes[option] += 1;
      }
      if (previousVote && previousVote !== option) {
        votes[previousVote] -= 1;
      }
      const newItem = { ...oldItem, votes };
      items.splice(oldIndex, 1, newItem);
      return { ...state, [target]: items };
    }
    default:
      return state;
  }
};

export default profile;
