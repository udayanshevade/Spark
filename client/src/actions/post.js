import { reset, SubmissionError } from 'redux-form';
import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { userUpdateVotes } from './user';
import { postsUpdateOffset } from './posts';

const APIbaseURL = '/posts';
const commentsURL = '/comments';
const categoriesURL = '/categories';
const categoryError = 'Category does not exist';

export const postSetLoading = loading => ({
  type: types.POST_SET_LOADING,
  loading,
});

export const postUpdateData = data => ({
  type: types.POST_UPDATE_DATA,
  data,
});

export const postSetSubmitStatus = submitStatus => ({
  type: types.POST_SET_SUBMIT_STATUS,
  submitStatus,
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
  const { comments: { selectedCriterion, sortDirection }, data } = post;
  if (selectedCriterion !== value) {
    dispatch(postUpdateSortCriterion(value));
  }
  if (sortDirection !== direction) {
    dispatch(postUpdateSortDirection(direction));
  }
  dispatch(postUpdateComments([]));
  dispatch(postCommentsUpdateOffset(0));
  dispatch(postGetComments(data.id));
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
    const newComments = offset ? [...oldComments, ...comments] : [...comments];
    dispatch(postUpdateComments(newComments));
    dispatch(postCommentsUpdateDepleted(depleted));
    dispatch(postCommentsUpdateOffset(offset + comments.filter(c => !c.parentId).length));
  }
};

export const postGetCommentThread = commentId => async(dispatch, getState) => {
  await dispatch(postCommentsUpdateDepleted(false));
  await dispatch(postCommentsUpdateOffset(0));
  await dispatch(postUpdateComments([]));
  dispatch(postGetComment(commentId, ''));
};

export const postGetComment = (commentId, descendantsOnly, offset = 0, limit = 10) => async(dispatch, getState) => {
  const { post } = getState();
  const { comments: oldComments } = post.comments;
  const url = `${commentsURL}/${commentId}/${descendantsOnly}`;
  const headers = { offset, limit };
  const res = await Requests.get({ url, headers });
  const comments = !res.error ? res.comments : [];
  const newComments = [...oldComments, ...comments];
  const parentIndex = newComments.findIndex((c) => c.id === commentId);
  const updatedComment = { ...newComments[parentIndex] };
  updatedComment.depleted = true;
  updatedComment.children = comments.filter(c => c.parentId === commentId).map(c => c.id);
  newComments.splice(parentIndex, 1, updatedComment);
  dispatch(postUpdateComments(newComments));
  return {
    offset: offset + updatedComment.children.length,
    depleted: res.depleted,
  };
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
  const res = await Requests.post({
    url: APIbaseURL,
    headers: { sessionToken },
    body: postData,
  });
  if (!res.error) {
    await dispatch(userUpdateVotes(res.id, 'upVote', null, 'posts', true));
    await dispatch(postUpdateData(res));
    dispatch(postResetCreateData());
    dispatch(postSetSubmitStatus('success'));
    dispatch(postSetCreating(false));
    dispatch(postsUpdateOffset(0));
    dispatch(reset('postCreateNew'));
  } else if (res.error.indexOf(categoryError) > -1) {
    dispatch(postSetCreating(false));
    throw new SubmissionError({ category: 'Category does not exist.' });
  }
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

export const postDelete = (postId, author, shouldDelete) => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) return;
  const { sessionToken, profile } = user.user;
  const res = await Requests.delete({
    url: `${APIbaseURL}/thread/${postId}/${author}/${shouldDelete}`,
    headers: {
      sessionToken,
      user: profile.id,
    },
  });
  if (!res.error) {
    const newVals = { deleted: shouldDelete === 'delete' };
    dispatch(postEditData(postId, newVals));
  }
};

export const postEdit = (postId, editedData) => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to submit a new post.', 'footer-login-button'));
    return;
  }
  const { sessionToken, profile } = user.user;
  dispatch(postSetCreating(true));
  const res = await Requests.put({
    url: `${APIbaseURL}/thread/${postId}/${profile.id}/edit`,
    headers: { sessionToken },
    body: editedData,
  });
  if (!res.error) {
    dispatch(postUpdateData(res.data));
    dispatch(postEditData(postId, res.data));
    dispatch(postResetCreateData());
    dispatch(postSetSubmitStatus('success'));
    dispatch(postSetCreating(false));
    dispatch(reset('postCreateNew'));
  } else if (res.error.indexOf(categoryError) > -1) {
    dispatch(postSetCreating(false));
    throw new SubmissionError({ category: 'Category does not exist.' });
  }
  dispatch(postSetCreating(false));
};
