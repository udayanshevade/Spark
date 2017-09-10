import * as types from '../actions/types';

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
    case types.POSTS_SET_LOADING:
      const { loading } = action; 
      return { ...state, loading };
    case types.POSTS_UPDATE:
      const { posts } = action;
      return { ...state, posts };
    case types.POSTS_SET_ACTIVE:
      const { active } = action;
      return { ...state, active };
    default:
      return state;
  }
};

export default posts;
