import * as types from './types';
import Requests from '../requests';

const APIbaseURL = '/user';

export const userLogin = ({ username, password }) => async(dispatch, getState) => {
  if (username && password) {
    const { loginForm } = getState().user;
    const userData = await Requests.post({
      url: `${APIbaseURL}/${username}/${loginForm}`,
      body: { password }
    });
    dispatch(userUpdateData(userData));
    dispatch(userSetLoggedIn(true));
    dispatch(userSetLoginActive(false));
  }
};

export const userLogout = () => (dispatch) => {
  dispatch(userSetLoggedIn(false));
  dispatch(userUpdateData(null));
};

export const userSetLoggedIn = loggedIn => ({
  type: types.USER_SET_LOGGED_IN,
  loggedIn,
});

export const userUpdateData = user => ({
  type: types.USER_UPDATE_DATA,
  user,
});

export const userSetLoginActive = loginActive => ({
  type: types.USER_SET_LOGIN_ACTIVE,
  loginActive,
});

export const userSelectLoginForm = loginForm => ({
  type: types.USER_SELECT_LOGIN_FORM,
  loginForm,
});

export const userSetLoading = loading => ({
  type: types.USER_SET_LOADING,
  loading,
});
