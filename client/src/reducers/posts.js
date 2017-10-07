import * as types from '../actions/types';

export const initialState = {
  query: '',
  posts: [],
  loading: false,
  active: '',
  offset: 0,
  limit: 10,
  depleted: false,
};

const posts = (state = initialState, action) => {
  switch(action.type) {
    case types.POSTS_QUERY_UPDATE: {
      const { query } = action;
      return {
        ...state,
        query,
      };
    }
    case types.POSTS_SET_LOADING: {
      const { loading } = action; 
      return { ...state, loading };
    }
    case types.POSTS_UPDATE: {
      const { posts } = action;
      return { ...state, posts };
    }
    case types.POSTS_UPDATE_OFFSET: {
      const { offset } = action;
      return { ...state, offset };
    }
    case types.POSTS_UPDATE_DEPLETED: {
      const { depleted } = action;
      return { ...state, depleted };
    }
    case types.POSTS_SET_ACTIVE: {
      const { active } = action;
      return { ...state, active };
    }
    case types.USER_UPDATE_VOTES: {
      const { id, option, previousVote, target } = action;
      if (target === 'comments' || 
        (!previousVote && previousVote === option)
      ) { return state; }
      const posts = [...state.posts];
      const oldIndex = posts.findIndex(item => item.id === id);
      if (oldIndex < 0) return state;
      const oldItem = posts[oldIndex];
      const votes = { ...oldItem.votes };
      if (option) {
        votes[option] += 1;
      }
      if (previousVote && previousVote !== option) {
        votes[previousVote] -= 1;
      }
      const newItem = { ...oldItem, votes };
      posts.splice(oldIndex, 1, newItem);
      return { ...state, posts: posts };
    }
    case types.POST_EDIT_DATA: {
      const { postId, vals } = action;
      const items = [...state.posts];
      const oldIndex = items.findIndex(item => item.id === postId);
      if (oldIndex < 0) return state;
      const oldItem = items[oldIndex];
      const newItem = { ...oldItem };
      Object.keys(vals).forEach((val) => {
        newItem[val] = vals[val];
      });
      items.splice(oldIndex, 1, newItem);
      return { ...state, posts: items };
    }
    default:
      return state;
  }
};

export default posts;
