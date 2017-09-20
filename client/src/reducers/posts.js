import * as types from '../actions/types';
import { determineVoteDelta } from '../utils';

export const initialState = {
  query: '',
  posts: [],
  loading: false,
  active: '',
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
    case types.POSTS_SET_ACTIVE: {
      const { active } = action;
      return { ...state, active };
    }
    case types.USER_UPDATE_VOTES: {
      const { id, option, previousVote, target } = action;
      if (target === 'comments') return state;
      const items = [...state.posts];
      const oldIndex = items.findIndex(item => item.id === id);
      if (oldIndex < 0) return state;
      const oldItem = items[oldIndex];
      const delta = determineVoteDelta(option, previousVote);
      const voteScore = oldItem.voteScore + delta;
      const newItem = { ...oldItem, voteScore };
      items.splice(oldIndex, 1, newItem);
      return { ...state, posts: items };
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
