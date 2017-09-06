import * as types from '../actions/types';

export const initialState = {
  loggedIn: false,
  user: null,
};

const user = (state = initialState, action) => {
  switch(action.type) {
    case types.USER_SET_LOGGED_IN:
      const { loggedIn } = action;
      return { ...state, loggedIn };
    case types.USER_UPDATE_DATA:
      const { user } = action;
      return { ...state, user };
    case types.RESET:
      return initialState;
    default:
      return state;
  }
};

export default user;
