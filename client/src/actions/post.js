import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { userUpdateVotes, userAddPost } from './user';

const APIbaseURL = '/posts';
const categoriesURL = '/categories';

export const postSetLoading = loading => ({
  type: types.POST_SET_LOADING,
  loading,
});

export const postUpdateData = data => ({
  type: types.POST_UPDATE_DATA,
  data,
});

export const postUpdateComments = comments => ({
  type: types.POST_UPDATE_COMMENTS,
  comments,
});

export const postCommentsUpdateOffset = offset => ({
  type: types.POST_COMMENTS_UPDATE_OFFSET,
  offset,
});

export const postCommentsUpdateDepleted = depleted => ({
  type: types.POST_COMMENTS_UPDATE_DEPLETED,
  depleted,
});

export const postUpdateSortCriterion = selectedCriterion => ({
  type: types.POST_COMMENTS_UPDATE_SORT_CRITERION,
  selectedCriterion,
});

export const postUpdateSortDirection = sortDirection => ({
  type: types.POST_COMMENTS_UPDATE_SORT_DIRECTION,
  sortDirection,
});

export const postSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { post } = getState();
  const { selectedCriterion, sortDirection } = post;
  if (selectedCriterion !== value) {
    dispatch(postUpdateSortCriterion(value));
  }
  if (sortDirection !== direction) {
    dispatch(postUpdateSortDirection(direction));
  }
  dispatch(postUpdateComments([]));
  dispatch(postCommentsUpdateOffset(0));
};

export const postGetData = postId => async(dispatch) => {
  const url = `${APIbaseURL}/thread/${postId}`;
  const data = await Requests.get({ url });
  dispatch(postUpdateData(data));
};

export const postGetComments = postId => async(dispatch, getState) => {
  const { post } = getState();
  const {
    comments: oldComments,
    offset,
    limit,
    selectedCriterion: criterion,
    sortDirection: direction,
  } = post.comments;
  const headers = { offset, limit, criterion, direction };
  const url = `${APIbaseURL}/thread/${postId}/comments`;
  const res = await Requests.get({ url, headers });
  if (!res.error) {
    const { comments, depleted } = res;
    const newComments = [...oldComments, ...comments];
    dispatch(postUpdateComments(newComments));
    dispatch(postCommentsUpdateDepleted(depleted));
    dispatch(postCommentsUpdateOffset(offset + limit));
  }
};

export const postGetDetails = postId => async(dispatch) => {
  dispatch(postSetLoading(true));
  await dispatch(postGetData(postId));
  await dispatch(postGetComments(postId));
  dispatch(postSetLoading(false));
};

export const postToggleShowFull = () => ({
  type: types.POST_TOGGLE_SHOW_FULL,
});

export const postEmpty = () => ({
  type: types.POST_EMPTY,
});

export const postSetCreating = creating => ({
  type: types.POST_SET_CREATING,
  creating,
});

export const postCreateNew = rawData => async(dispatch, getState) => {
  dispatch(postUpdateData(null));
  const { user } = getState();
  if (!user.user) {
    appShowTipWithText('Login to submit a new post.', 'footer-login-button');
    return;
  }
  const { sessionToken, profile } = user.user;
  dispatch(postSetCreating(true));
  const postData = {
    ...rawData,
    author: profile.id,
  };
  const data = await Requests.post({
    url: APIbaseURL,
    headers: { sessionToken },
    body: { ...postData },
  });
  if (!data.error) {
    await dispatch(userUpdateVotes(data.id, 'upVote', null, 'posts', true));
    await dispatch(postUpdateData(data));
    dispatch(userAddPost(data.id));
  }
  dispatch(postSetCreating(false));
};

export const postUpdateCategorySuggestions = results => ({
  type: types.POST_UPDATE_CATEGORY_SUGGESTIONS,
  results,
});

export const postLoadCategorySuggestions = query => async(dispatch) => {
  const url = `${categoriesURL}/suggestions/${query}/suggestions`;
  const suggestions = await Requests.get({ url });
  dispatch(postUpdateCategorySuggestions(suggestions));
};

export const postGetCategorySuggestions = query => async(dispatch, getState) => {
  const { post } = getState();
  const { categorySuggestions } = post;
  const { timeoutId, timeoutLength } = categorySuggestions;
  // clear prior timeout if still typing
  clearTimeout(timeoutId);
  const newTimeoutId = setTimeout(() => {
    // load appropriate data
    dispatch(postLoadCategorySuggestions(query));
  }, timeoutLength);
  dispatch(postCategorySuggestionsSetTimeout(newTimeoutId));
};

export const postCategorySuggestionsSetTimeout = timeoutId => ({
  type: types.POST_CATEGORIES_SET_TIMEOUT,
  timeoutId,
});

export const postResetCreateData = () => (dispatch) => {
  dispatch(postUpdateCreateData({
    title: '',
    url: '',
    body: '',
    category: '',
  }));
};

export const postUpdateCreateData = createData => ({
  type: types.POST_UPDATE_CREATE_DATA,
  createData,
});

export const postEditData = (postId, vals) => ({
  type: types.POST_EDIT_DATA,
  postId,
  vals,
});

export const postDelete = postId => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) return;
  const { sessionToken, profile } = user.user;
  const res = await Requests.delete({
    url: `${APIbaseURL}/thread/${postId}/delete`,
    headers: { sessionToken },
    body: { userId: profile.id },
  });
  if (!res.error) {
    const newVals = { deleted: true };
    dispatch(postEditData(postId, newVals))
  }
};

export const postEdit = (postId, editedData) => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to submit a new post.', 'footer-login-button'));
    return;
  }
  const { sessionToken } = user.user;
  dispatch(postSetCreating(true));
  const data = await Requests.put({
    url: `${APIbaseURL}/thread/${postId}/edit`,
    headers: { sessionToken },
    body: { ...editedData },
  });
  if (!data.error) {
    dispatch(postUpdateData(data));
    dispatch(postEditData(postId, editedData));
  }
  dispatch(postSetCreating(false));
};
