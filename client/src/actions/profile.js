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

export const profileSetLoading = (loading, affects) => ({
  type: types.PROFILE_SET_LOADING,
  loading,
  affects,
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
  const { profile: profileState, user: userState } = getState();
  const { posts: postsState } = profileState;
  const { user: userData } = userState;
  let username;
  if (userData && userData.profile) {
    username = userData.profile.id;
  }
  const {
    posts: oldPosts,
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
  if (username) {
    headers.username = username;
  }
  dispatch(profileSetLoading(true, 'posts'));
  const res = await Requests.get({
    url,
    headers,
  });
  if (!res.error) {
    const { posts, depleted } = res;
    const newPosts = [ ...oldPosts, ...posts ];
    dispatch(profileUpdatePosts(newPosts));
    dispatch(profileUpdateDepleted(depleted, 'posts'));
    dispatch(profileUpdateOffset(offset + posts.length, 'posts'));
  }
  dispatch(profileSetLoading(false, 'posts'));
};

export const profileGetComments = profile => async(dispatch, getState) => {
  const { comments: commentsState } = getState().profile;
  const url = `${APIbaseURL}/${profile}/comments`;
  const {
    comments: oldComments,
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
  dispatch(profileSetLoading(true, 'comments'));
  const res = await Requests.get({ url, headers });
  if (!res.error) {
    const { comments, depleted } = res;
    const newComments = [ ...oldComments, ...comments ];
    dispatch(profileUpdateComments(newComments));
    dispatch(profileUpdateDepleted(depleted, 'comments'));
    dispatch(profileUpdateOffset(offset + comments.length, 'comments'));
  }
  dispatch(profileSetLoading(false, 'comments'));
};

export const profileGetActivity = profile => async(dispatch) => {
  dispatch(profileGetPosts(profile));
  dispatch(profileGetComments(profile));
};

export const profilePostsSelectSortCriterion = ({
  value,
  direction,
}) => (dispatch, getState) => {
  const { profile } = getState();
  const { selectedCriterion, sortDirection } = profile.posts;
  if (selectedCriterion !== value) {
    dispatch(profileUpdateSortCriterion(value, 'posts'));
  }
  if (sortDirection !== direction) {
    dispatch(profileUpdateSortDirection(direction, 'posts'));
  }
  dispatch(profileUpdatePosts([]));
  dispatch(profileUpdateOffset(0, 'posts'));
  dispatch(profileGetPosts(profile.username));
};

export const profileUpdateSortCriterion = (selectedCriterion, affects) => ({
  type: types.PROFILE_UPDATE_SORT_CRITERION,
  selectedCriterion,
  affects,
});

export const profileUpdateSortDirection = (sortDirection, affects) => ({
  type: types.PROFILE_UPDATE_SORT_DIRECTION,
  sortDirection,
  affects,
});

export const profileCommentsSelectSortCriterion = ({
  value,
  direction,
}) => (dispatch, getState) => {
  const { profile } = getState();
  const { selectedCriterion, sortDirection } = profile.comments;
  if (selectedCriterion !== value) {
    dispatch(profileUpdateSortCriterion(value, 'comments'));
  }
  if (sortDirection !== direction) {
    dispatch(profileUpdateSortDirection(direction, 'comments'));
  }
  dispatch(profileUpdateComments([]));
  dispatch(profileUpdateOffset(0, 'comments'));
  dispatch(profileGetComments(profile.username));
};

export const profileReset = () => ({
  type: types.PROFILE_RESET,
});
