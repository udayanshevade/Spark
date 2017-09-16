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
    case types.POST_UPDATE_VOTE: {
      const { id, option, previousVote } = action;
      const posts = [...state.posts];
      const oldPostIndex = posts.findIndex((post) => (post.id === id));
      if (oldPostIndex < 0) return state;
      const oldPost = posts[oldPostIndex];
      let delta = 0;
      if ((!previousVote && option === 'upVote') ||
        (!option && previousVote === 'downVote')) {
        delta = 1;
      } else if ((!previousVote && option === 'downVote') ||
        (!option && previousVote === 'upVote')) {
        delta = -1;
      } else if (previousVote === 'downVote' && option ==='upVote') {
        delta = 2;
      } else if (previousVote === 'upVote' && option === 'downVote') {
        delta = -2;
      }
      const voteScore = oldPost.voteScore + delta;
      const newPost = { ...oldPost, voteScore };
      posts.splice(oldPostIndex, 1, newPost);
      return { ...state, posts };
    }
    default:
      return state;
  }
};

export default posts;
