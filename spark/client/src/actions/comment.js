import { SubmissionError } from 'redux-form';
import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { userAddComment } from './user';

const APIbaseURL = '/comments';

export const commentEditData = (commentId, vals, postId) => ({
  type: types.COMMENT_EDIT_DATA,
  commentId,
  vals,
  postId,
});

export const commentAddNew = commentData => ({
  type: types.COMMENT_ADD_NEW,
  commentData,
});

export const commentUpdate = formData => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to edit comments.', 'footer-login-button'));
    return;
  }
  const {
    postId,
    id,
    ...newComment,
  } = formData;
  if (!newComment.body) {
    throw new SubmissionError({ body: 'Nothing here' });
  }
  const { sessionToken, profile: userData } = user.user;
  const url = `${APIbaseURL}/${id}/${userData.id}/edit`;
  const res = await Requests.put({
    url,
    headers: { sessionToken },
    body: newComment,
  });
  if (res.error) return false;
  dispatch(commentEditData(id, { body: newComment.body }, postId));
  return true;
};

export const commentCreateNew = formData => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to comment.', 'footer-login-button'));
    return;
  }
  const { sessionToken, profile: userData } = user.user;
  const newComment = {
    ...formData,
    author: userData.id,
  };
  if (!newComment.body) {
    throw new SubmissionError({ body: 'Nothing here' });
  }
  const newCommentData = await Requests.post({
    url: APIbaseURL,
    headers: { sessionToken },
    body: newComment,
  });
  if (newCommentData.error) return false;
  dispatch(commentAddNew(newCommentData));
  dispatch(userAddComment(newCommentData.id));
  return true;
};

export const commentDelete = (commentId, deleted, author, postId) => async(dispatch, getState) => {
  const { user } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to delete comments.', 'footer-login-button'));
    return;
  }
  const { sessionToken, profile: userData } = user.user;
  const url = `${APIbaseURL}/${commentId}/${author}/${deleted ? 'restore' : 'delete'}`;
  const res = await Requests.delete({
    url,
    headers: {
      sessionToken,
      user: userData.id,
    },
  });
  if (res.error) return;
  dispatch(commentEditData(commentId, { deleted: !deleted }, postId));
};
