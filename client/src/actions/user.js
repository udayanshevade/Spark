import * as types from './types';

export const userSetLoggedIn = loggedIn => ({
  type: types.USER_SET_LOGGED_IN,
  loggedIn,
});

export const userUpdateData = user => ({
  type: types.USER_UPDATE_DATA,
  user,
});
