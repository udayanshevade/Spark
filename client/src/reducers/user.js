import * as types from '../actions/types';

export const initialState = {
  loggedIn: false,
  user: null,
  posts: [],
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
  comments: [],
  commentsSelectedCriterion: 'timestamp',
  commentsSortDirection: 'desc',
  loginActive: false,
  loginForm: 'login',
  loading: false,
  profilePreviewActive: false,
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case types.USER_SET_LOGGED_IN: {
      const { loggedIn } = action;
      return { ...state, loggedIn };
    }
    case types.USER_UPDATE_DATA: {
      const { user } = action;
      return { ...state, user };
    }
    case types.USER_UPDATE_ACTIVITY: {
      const { posts, comments } = action;
      const newState = { ...state };
      if (posts) newState.posts = posts;
      if (comments) newState.comments = comments;
      return newState;
    }
    case types.USER_SET_LOGIN_ACTIVE: {
      const { loginActive } = action;
      return { ...state, loginActive };
    }
    case types.USER_SELECT_LOGIN_FORM: {
      const { loginForm } = action;
      return { ...state, loginForm };
    }
    case types.USER_SET_LOADING: {
      const { loading } = action;
      return { ...state, loading };
    }
    case types.USER_SET_PROFILE_PREVIEW_ACTIVE: {
      const { profilePreviewActive } = action;
      return { ...state, profilePreviewActive };
    }
    case types.USER_POSTS_UPDATE_SORT_CRITERION: {
      const { postsSelectedCriterion } = action;
      return { ...state, postsSelectedCriterion };
    }
    case types.USER_POSTS_UPDATE_SORT_DIRECTION: {
      const { postsSortDirection } = action;
      return { ...state, postsSortDirection };
    }
    case types.USER_COMMENTS_UPDATE_SORT_CRITERION: {
      const { commentsSelectedCriterion } = action;
      return { ...state, commentsSelectedCriterion };
    }
    case types.USER_COMMENTS_UPDATE_SORT_DIRECTION: {
      const { commentsSortDirection } = action;
      return { ...state, commentsSortDirection };
    }
    case types.RESET:
      return initialState;
    default:
      return state;
  }
};

export default user;
