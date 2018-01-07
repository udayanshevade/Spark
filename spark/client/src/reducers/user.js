import * as types from '../actions/types';

export const initialState = {
  loggedIn: false,
  isLoggingIn: false,
  user: null,
  loginActive: false,
  loginForm: 'login',
  loading: false,
  defaultValues: {
    username: '',
    password: '',
  },
  loginError: [],
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case types.USER_SET_LOGGED_IN: {
      const { loggedIn } = action;
      return { ...state, loggedIn };
    }
    case types.USER_SET_LOGGING_IN: {
      const { isLoggingIn } = action;
      return {
        ...state,
        isLoggingIn,
      };
    }
    case types.USER_UPDATE_DATA: {
      const { user } = action;
      return { ...state, user };
    }
    case types.USER_SET_LOGIN_ERROR: {
      const { loginError } = action;
      return { ...state, loginError };
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
    case types.USER_UPDATE_VOTES: {
      const { id, option } = action;
      const votesGiven = {
        ...state.user.profile.votesGiven,
        [id]: option,
      };
      return {
        ...state,
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            votesGiven,
          },
        },
      };
    }
    case types.USER_ADD_POST: {
      const { postId } = action;
      let newState = { ...state };
      if (newState.user) {
        newState.user.profile.posts.unshift(postId);
      }
      return newState;
    }
    case types.USER_ADD_COMMENT: {
      const { commentId } = action;
      let newState = { ...state };
      if (state.user) {
        newState.user = {
          ...state.user,
          profile: {
            ...state.user.profile,
            votesGiven: {
              ...state.user.profile.votesGiven,
              [commentId]: 'upVote',
            },
            commentsVotesReceived: {
              ...state.user.profile.commentsVotesReceived,
              upVote: state.user.profile.commentsVotesReceived.upVote + 1,
            },
          },
        };
      }
      return newState;
    }
    case types.USER_RESET_LOGIN_FORM:
      return {
        ...initialState,
        user: state.user,
        loggedIn: state.loggedIn,
      };
    case types.RESET:
      return initialState;
    default:
      return state;
  }
};

export default user;
