import * as types from './types';
import Requests from '../requests';
import { postUpdateVote } from './posts';
// import { commentUpdateVote } from './comments';

const userBaseURL = '/user';
const commentBaseURL = '/comments';
const postBaseURL = '/posts/thread';

const votePaths = {
  comment: commentBaseURL,
  post: postBaseURL,
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

export const userRecordVote = (type, id, voted) => async(dispatch, getState) => {
  const url = `${votePaths[type]}/${id}/vote`;
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
    dispatch(userUpdateVotes(id, option));
    if (type === 'post') {
      dispatch(postUpdateVote(id, option, previousVote));
    }
  }
};

export const userUpdateVotes = (id, option) => ({
  type: types.USER_UPDATE_VOTES,
  id,
  option,
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
