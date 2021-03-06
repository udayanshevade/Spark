import * as types from '../actions/types';

export const initialState = {
  data: null,
  comments: {
    comments: [],
    offset: 0,
    limit: 10,
    depleted: false,
    selectedCriterion: 'best',
    sortDirection: 'desc',
    criteria: [{
      label: 'Hot',
      value: 'hot',
      direction: 'desc',
    }, {
      label: 'Best',
      value: 'best',
      direction: 'desc',
    }, {
      label: 'New',
      value: 'new',
      direction: 'desc'
    }, {
      label: 'Score',
      value: 'score',
      direction: 'desc',
    }],
  },
  loading: false,
  creating: false,
  showFull: false,
  bodyCharLim: 90,
  categorySuggestions: {
    results: [],
    timeoutId: null,
    timeoutLength: 750,
  },
  submitStatus: 'pending',
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
      return {
        ...state,
        comments: {
          ...state.comments,
          comments,
        },
      };
    }
    case types.POST_COMMENTS_UPDATE_OFFSET: {
      const { offset } = action;
      return {
        ...state,
        comments: {
          ...state.comments,
          offset,
        },
      };
    }
    case types.POST_COMMENTS_UPDATE_DEPLETED: {
      const { depleted } = action;
      return {
        ...state,
        comments: {
          ...state.comments,
          depleted,
        },
      };
    }
    case types.POST_COMMENTS_UPDATE_SORT_CRITERION: {
      const { selectedCriterion } = action;
      return {
        ...state,
        comments: {
          ...state.comments,
          selectedCriterion,
        },
      };
    }
    case types.POST_COMMENTS_UPDATE_SORT_DIRECTION: {
      const { sortDirection } = action;
      return {
        ...state,
        comments: {
          ...state.comments,
          sortDirection,
        },
      };
    }
    case types.COMMENT_EDIT_DATA: {
      const { commentId, vals, postId } = action;
      const { comments: { comments: oldComments }, data } = state;
      let newState = state;
      if (data && data.id === postId) {
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
      }
      return newState;
    }
    case types.COMMENT_ADD_NEW: {
      const { commentData } = action;
      const { data, comments: { comments: oldComments } } = state;
      let newState = state;
      if (data && data.id === commentData.postId) {
        const newComments = [...oldComments];
        newComments.push(commentData);
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
          const {
            comments: {
              comments: oldComments,
              ...commentsState,
            },
          } = state;
          if (!oldComments.length) return state;
          const comments = [...oldComments];
          const oldIndex = comments.findIndex(item => item.id === id);
          if (oldIndex < 0) return state;
          const oldItem = comments[oldIndex];
          const votes = { ...oldItem.votes };
          if (option) {
            votes[option] += 1;
          }
          if (previousVote && previousVote !== option) {
            votes[previousVote] -= 1;
          }
          const newItem = { ...oldItem, votes };
          comments.splice(oldIndex, 1, newItem);
          return {
            ...state,
            comments: {
              ...commentsState,
              comments,
            },
          };
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
        submitStatus: 'pending',
        createData: {
          ...state.createData,
          ...createData,
        },
      };
    }
    case types.POST_SET_SUBMIT_STATUS: {
      const { submitStatus } = action;
      return {
        ...state,
        submitStatus,
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
