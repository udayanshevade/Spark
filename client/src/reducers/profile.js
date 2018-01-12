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
    case types.POST_EDIT_DATA: {
      const { postId, vals } = action;
      const items = [...state.posts.posts];
      const oldIndex = items.findIndex(item => item.id === postId);
      if (oldIndex < 0) return state;
      const oldItem = items[oldIndex];
      const newItem = { ...oldItem };
      Object.keys(vals).forEach((val) => {
        newItem[val] = vals[val];
      });
      items.splice(oldIndex, 1, newItem);
      return {
        ...state,
        posts: {
          ...state.posts,
          posts: items,
        },
      };
    }
    case types.COMMENT_EDIT_DATA: {
      const { commentId, vals } = action;
      const { comments: { comments: oldComments } } = state;
      let newState = state;
      const oldIndex = oldComments.findIndex(c => c.id === commentId);
      if (oldIndex > -1) {
        const newComments = [...oldComments];
        const newComment = { ...oldComments[oldIndex] };
        Object.keys(vals).forEach((val) => {
          newComment[val] = vals[val];
        });
        newComments.splice(oldIndex, 1, newComment);
        newState = {
          ...state,
          comments: {
            ...state.comments,
            comments: newComments,
          },
        };
      }
      return newState;
    }
    case types.COMMENT_ADD_NEW: {
      const { commentData } = action;
      const { comments: { comments: oldComments }, previewActive } = state;
      let newState = state;
      if (previewActive) {
        const newComments = [...oldComments];
        newComments.unshift(commentData);
        const parentIndex = newComments.findIndex(c => c.id === commentData.parentId);
        if (parentIndex > -1) {
          const editedParent = { ...oldComments[parentIndex] };
          editedParent.children = [...editedParent.children];
          editedParent.children.unshift(commentData.id);
          newComments.splice(parentIndex, 1, editedParent);
        }
        newState = {
          ...state,
          comments: {
            ...state.comments,
            comments: newComments,
          },
        };
      }
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
      const items = [...state[target][target]];
      const oldIndex = items.findIndex(item => item.id === id);
      if (oldIndex < 0) return state;
      const oldItem = items[oldIndex];
      const votes = { ...oldItem.votes };
      const newProfile = { ...state.user };
      if (option) {
        votes[option] = (+votes[option]) + 1;
        newProfile[`${target}VotesReceived`][option] = (+newProfile[`${target}VotesReceived`][option]) + 1;
        if (!previousVote) {
          newProfile.votesGiven[id] = option;
        }
      }
      if (previousVote && previousVote !== option) {
        votes[previousVote] = (+votes[previousVote]) - 1;
        newProfile[`${target}VotesReceived`][previousVote] = (+newProfile[`${target}VotesReceived`][previousVote]) - 1;
        newProfile.votesGiven[id] = option;
      }
      const newItem = { ...oldItem, votes };
      items.splice(oldIndex, 1, newItem);
      return {
        ...state,
        user: newProfile,
        [target]: {
          ...state[target],
          [target]: items,
        },
      };
    }
    default:
      return state;
  }
};

export default profile;
