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

export const profileUpdatePosts = posts => ({
  type: types.PROFILE_UPDATE_POSTS,
  posts,
});

export const profileUpdateComments = comments => ({
  type: types.PROFILE_UPDATE_COMMENTS,
  comments,
});

export const profileUpdateOffset = (offset, affects) => ({
  type: types.PROFILE_UPDATE_OFFSET,
  offset,
  affects,
});

export const profileUpdateDepleted = (depleted, affects) => ({
  type: types.PROFILE_UPDATE_DEPLETED,
  depleted,
  affects,
});

export const profileGetPosts = profile => async(dispatch, getState) => {
  const { posts: postsState } = getState().profile;
  const {
    offset,
    limit,
    sortDirection: direction,
    selectedCriterion: criterion,
  } = postsState;
  const url = `${APIbaseURL}/${profile}/posts`;
  const headers = {
    offset,
    limit,
    direction,
    criterion,
  };
  const res = await Requests.get({
    url,
    headers,
  });
  if (!res.error) {
    const { posts, depleted } = res;
    dispatch(profileUpdatePosts(posts));
    dispatch(profileUpdateDepleted('posts', depleted));
  }
};

export const profileGetComments = profile => async(dispatch, getState) => {
  const { comments: commentsState } = getState().profile;
  const url = `${APIbaseURL}/${profile}/comments`;
  const {
    offset,
    limit,
    sortDirection: direction,
    selectedCriterion: criterion,
  } = commentsState;
  const headers = {
    offset,
    limit,
    direction,
    criterion,
  };
  const res = await Requests.get({ url, headers });
  if (!res.error) {
    const { comments, depleted } = res;
    dispatch(profileUpdateComments(comments));
    dispatch(profileUpdateDepleted('comments', depleted));
  }
};

export const profileGetActivity = profile => async(dispatch) => {
  dispatch(profileGetPosts(profile));
  dispatch(profileGetComments(profile));
};

export const profilePostsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { profile } = getState();
  const { selectedCriterion, sortDirection } = profile.posts;
  if (selectedCriterion !== value) {
    dispatch(profileUpdateSortCriterion('posts', value));
  }
  if (sortDirection !== direction) {
    dispatch(profileUpdateSortDirection('posts', direction));
  }
};

export const profileUpdateSortCriterion = (affects, selectedCriterion) => ({
  type: types.PROFILE_UPDATE_SORT_CRITERION,
  selectedCriterion,
  affects,
});

export const profileUpdateSortDirection = (affects, sortDirection) => ({
  type: types.PROFILE_UPDATE_SORT_DIRECTION,
  sortDirection,
  affects,
});

export const profileCommentsSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { profile } = getState();
  const { selectedCriterion, sortDirection } = profile.comments;
  if (selectedCriterion !== value) {
    dispatch(profileUpdateSortCriterion('comments', value));
  }
  if (sortDirection !== direction) {
    dispatch(profileUpdateSortDirection('comments', direction));
  }
};

export const profileReset = () => ({
  type: types.PROFILE_RESET,
});
