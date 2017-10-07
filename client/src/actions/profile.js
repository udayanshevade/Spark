import * as types from './types';
import Requests from '../requests';

const APIbaseURL = '/user';

export const profileSetUser = username => (dispatch) => {
  dispatch(profileSetUsername(username));
  dispatch(profileGetData(username));
  dispatch(profileGetActivity(username));
  dispatch(profileSetPreviewActive(true));
};

export const profileSetUsername = username => ({
  type: types.PROFILE_SET_USERNAME,
  username,
});

export const profileGetData = profile => async(dispatch) => {
  dispatch(profileSetLoading(true));
  const url = `${APIbaseURL}/${profile}/profile`;
  const user = await Requests.get({ url });
  dispatch(profileUpdateData(user));
  dispatch(profileSetLoading(false));
};

export const profileSetLoading = loading => ({
  type: types.PROFILE_SET_LOADING,
  loading,
});

export const profileUpdateData = user => ({
  type: types.PROFILE_UPDATE_DATA,
  user,
});

export const profileSetPreviewActive = previewActive => ({
  type: types.PROFILE_SET_PREVIEW_ACTIVE,
  previewActive,
});

export const profileUpdateActivity = ({ posts, comments }) => ({
  type: types.PROFILE_UPDATE_ACTIVITY,
  posts,
  comments,
});

export const profileGetActivity = (profile) => async(dispatch) => {
  const url = `${APIbaseURL}/${profile}/history`;
  const activity = await Requests.get({ url });
  dispatch(profileUpdateActivity(activity));
};

export const profilePostsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { profile } = getState();
  const { postsSelectedCriterion, postsSortDirection } = profile;
  if (postsSelectedCriterion !== value) {
    dispatch(profilePostsUpdateSortCriterion(value));
  }
  if (postsSortDirection !== direction) {
    dispatch(profilePostsUpdateSortDirection(direction));
  }
};

export const profilePostsUpdateSortCriterion = postsSelectedCriterion => ({
  type: types.PROFILE_POSTS_UPDATE_SORT_CRITERION,
  postsSelectedCriterion,
});

export const profilePostsUpdateSortDirection = postsSortDirection => ({
  type: types.PROFILE_POSTS_UPDATE_SORT_DIRECTION,
  postsSortDirection,
});

export const profileCommentsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { profile } = getState();
  const { commentsSelectedCriterion, commentsSortDirection } = profile;
  if (commentsSelectedCriterion !== value) {
    dispatch(profileCommentsUpdateSortCriterion(value));
  }
  if (commentsSortDirection !== direction) {
    dispatch(profileCommentsUpdateSortDirection(direction));
  }
};

export const profileCommentsUpdateSortCriterion = commentsSelectedCriterion => ({
  type: types.PROFILE_COMMENTS_UPDATE_SORT_CRITERION,
  commentsSelectedCriterion,
});

export const profileCommentsUpdateSortDirection = commentsSortDirection => ({
  type: types.PROFILE_COMMENTS_UPDATE_SORT_DIRECTION,
  commentsSortDirection,
});

export const profileReset = () => ({
  type: types.PROFILE_RESET,
});
