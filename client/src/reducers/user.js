import * as types from '../actions/types';

export const initialState = {
  loggedIn: false,
  user: null,
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
    case types.RESET:
      return initialState;
    default:
      return state;
  }
};

export default user;
