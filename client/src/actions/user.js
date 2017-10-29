import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { categoriesUpdateSubscribers } from './categories';

const userBaseURL = '/user';
const commentBaseURL = '/comments';
const postBaseURL = '/posts/thread';
const categoriesURL = '/categories';

const votePaths = {
  comments: commentBaseURL,
  posts: postBaseURL,
};

export const userSetLoggingIn = isLoggingIn => ({
  type: types.USER_SET_LOGGING_IN,
  isLoggingIn,
});

export const userLogin = ({ username, password }) => async(dispatch, getState) => {
  if (username && password) {
    dispatch(userSetLoggingIn(true));
    const { loginForm } = getState().user;
    const userData = await Requests.post({
      url: `${userBaseURL}/${username}/${loginForm}`,
      body: { password },
    });
    if (userData.sessionToken) {
      dispatch(userUpdateData(userData));
      dispatch(userSetLoggingIn(false));
      dispatch(userSetLoggedIn(true));
      dispatch(userSetLoginActive(false));
    }
  }
};

export const userRecordVote = (target, id, voted) => async(dispatch, getState) => {
  const url = `${votePaths[target]}/${id}/vote`;
  const { user } = getState();
  if (!user.user) {
    const tipText = 'Login to vote, share or comment.';
    dispatch(appShowTipWithText(tipText, 'footer-login-button'));
    return;
  }
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

export const userUpdateVotes = (id, option, previousVote, target, isNew) => ({
  type: types.USER_UPDATE_VOTES,
  id,
  option,
  previousVote,
  target,
  isNew,
});

export const userAddPost = postId => ({
  type: types.USER_ADD_POST,
  postId,
});

export const userAddComment = commentId => ({
  type: types.USER_ADD_COMMENT,
  commentId,
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

export const userResetLoginForm = () => ({
  type: types.USER_RESET_LOGIN_FORM,
});

export const userSubscribeCategory = category => async(dispatch, getState) => {
  const { user: { user } } = getState();
  if (!user) {
    const tipText = 'Login to subscribe.';
    dispatch(appShowTipWithText(tipText, 'footer-login-button'));
    return;
  }
  const { subscriptions, sessionToken, profile } = user;
  const { id: userId } = profile;
  const newSubscriptions = [...subscriptions];
  const subscriptionIndex = subscriptions.indexOf(category);
  let update = '';
  if (subscriptionIndex > -1) {
    update = 'unsubscribe';
    newSubscriptions.splice(subscriptionIndex, 1);
  } else {
    update = 'subscribe';
    newSubscriptions.unshift(category);
  }
  const url = `${categoriesURL}/subscribe/${category}/${update}`;
  const res = await Requests.put({
    url,
    headers: { sessionToken },
    body: { userId },
  });
  if (res.success) {
    dispatch(userUpdateData({ ...user, subscriptions: newSubscriptions }));
    dispatch(categoriesUpdateSubscribers(category, res.success));
  }
};
