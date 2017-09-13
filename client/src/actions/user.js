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
    if (userData.sessionToken) {
      dispatch(userUpdateData(userData));
      dispatch(userSetLoggedIn(true));
      dispatch(userSetLoginActive(false));
    }
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

export const userSetProfilePreviewActive = profilePreviewActive => ({
  type: types.USER_SET_PROFILE_PREVIEW_ACTIVE,
  profilePreviewActive,
});

export const userUpdateActivity = ({ posts, comments }) => ({
  type: types.USER_UPDATE_ACTIVITY,
  posts,
  comments,
});

export const userGetActivity = (user) => async(dispatch) => {
  const activity = await Requests.get(`${APIbaseURL}/${user}/history`);
  dispatch(userUpdateActivity(activity));
};

export const userPostsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { user } = getState();
  const { postsSelectedCriterion, postsSortDirection } = user;
  if (postsSelectedCriterion !== value) {
    dispatch(userPostsUpdateSortCriterion(value));
  }
  if (postsSortDirection !== direction) {
    dispatch(userPostsUpdateSortDirection(direction));
  }
};

export const userPostsUpdateSortCriterion = postsSelectedCriterion => ({
  type: types.USER_POSTS_UPDATE_SORT_CRITERION,
  postsSelectedCriterion,
});

export const userPostsUpdateSortDirection = postsSortDirection => ({
  type: types.USER_POSTS_UPDATE_SORT_DIRECTION,
  postsSortDirection,
});

export const userCommentsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { user } = getState();
  const { commentsSelectedCriterion, commentsSortDirection } = user;
  if (commentsSelectedCriterion !== value) {
    dispatch(userCommentsUpdateSortCriterion(value));
  }
  if (commentsSortDirection !== direction) {
    dispatch(userCommentsUpdateSortDirection(direction));
  }
};

export const userCommentsUpdateSortCriterion = commentsSelectedCriterion => ({
  type: types.USER_COMMENTS_UPDATE_SORT_CRITERION,
  commentsSelectedCriterion,
});

export const userCommentsUpdateSortDirection = commentsSortDirection => ({
  type: types.USER_COMMENTS_UPDATE_SORT_DIRECTION,
  commentsSortDirection,
});
