import * as types from './types';
import Requests from '../requests';

const userBaseURL = '/user';
const commentBaseURL = '/comments';
const postBaseURL = '/posts/thread';

const votePaths = {
  comments: commentBaseURL,
  posts: postBaseURL,
};

export const userLogin = ({ username, password }) => async(dispatch, getState) => {
  if (username && password) {
    const { loginForm } = getState().user;
    const userData = await Requests.post({
      url: `${userBaseURL}/${username}/${loginForm}`,
      body: { password },
    });
    if (userData.sessionToken) {
      dispatch(userUpdateData(userData));
      dispatch(userSetLoggedIn(true));
      dispatch(userSetLoginActive(false));
    }
  }
};

export const userRecordVote = (target, id, voted) => async(dispatch, getState) => {
  const url = `${votePaths[target]}/${id}/vote`;
  const { user } = getState();
  if (!user.user) return;
  const { sessionToken, profile } = user.user;
  const { id: voterId, votesGiven } = profile;
  const previousVote = votesGiven[id];
  const option = voted === previousVote ? null : voted;
  const res = await Requests.put({
    url,  
    headers: { sessionToken },
    body: { option, voterId },
  });
  if (!res.error) {
    dispatch(userUpdateVotes(id, option, previousVote, target));
  }
};

export const userUpdateVotes = (id, option, previousVote, target) => ({
  type: types.USER_UPDATE_VOTES,
  id,
  option,
  previousVote,
  target,
});

export const userUpdateData = user => ({
  type: types.USER_UPDATE_DATA,
  user,
});

export const userLogout = () => (dispatch) => {
  dispatch(userSetLoggedIn(false));
  dispatch(userUpdateData(null));
};

export const userSetLoggedIn = loggedIn => ({
  type: types.USER_SET_LOGGED_IN,
  loggedIn,
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
