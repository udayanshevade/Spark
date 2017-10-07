import * as types from '../actions/types';

export const initialState = {
  username: '',
  user: null,
  posts: [],
  comments: [],
  sortCriteria: [{
    label: 'New',
    value: 'timestamp',
    direction: 'desc'
  }, {
    label: 'Score',
    value: 'voteScore',
    direction: 'desc',
  }],
  postsSelectedCriterion: 'timestamp',
  postsSortDirection: 'desc',
  commentsSelectedCriterion: 'timestamp',
  commentsSortDirection: 'desc',
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
      const { loading } = action;
      return { ...state, loading };
    }
    case types.PROFILE_UPDATE_DATA: {
      const { user } = action;
      return { ...state, user };
    }
    case types.PROFILE_UPDATE_ACTIVITY: {
      const { posts, comments } = action;
      const newState = { ...state };
      if (posts && posts.length) newState.posts = posts;
      if (comments && comments.length) newState.comments = comments;
      return newState; 
    }
    case types.PROFILE_SET_PREVIEW_ACTIVE: {
      const { previewActive } = action;
      return { ...state, previewActive };
    }
    case types.PROFILE_POSTS_UPDATE_SORT_CRITERION: {
      const { postsSelectedCriterion } = action;
      return { ...state, postsSelectedCriterion };
    }
    case types.PROFILE_POSTS_UPDATE_SORT_DIRECTION: {
      const { postsSortDirection } = action;
      return { ...state, postsSortDirection };
    }
    case types.PROFILE_COMMENTS_UPDATE_SORT_CRITERION: {
      const { commentsSelectedCriterion } = action;
      return { ...state, commentsSelectedCriterion };
    }
    case types.PROFILE_COMMENTS_UPDATE_SORT_DIRECTION: {
      const { commentsSortDirection } = action;
      return { ...state, commentsSortDirection };
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
