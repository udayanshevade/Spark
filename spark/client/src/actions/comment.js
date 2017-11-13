import { SubmissionError } from 'redux-form';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { postUpdateComments } from './post';
import { userAddComment } from './user';

const APIbaseURL = '/comments';

export const commentUpdate = formData => async(dispatch, getState) => {
  const { user, post } = getState();
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
  const { sessionToken } = user.user;
  const url = `${APIbaseURL}/${id}/edit`;
  const newCommentData = await Requests.put({
    url,
    headers: { sessionToken },
    body: newComment,
  });
  if (newCommentData.error) return false;
  const { data: postData, comments: { comments: postComments } } = post;
  if (postData && postData.id === postId) {
    const newPostComments = [...postComments];
    const oldIndex = newPostComments.findIndex(comment => comment.id === id);
    newPostComments.splice(oldIndex, 1, newCommentData);
    await dispatch(postUpdateComments(newPostComments));
  }
  return true;
};

export const commentCreateNew = formData => async(dispatch, getState) => {
  const { user, post } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to comment.', 'footer-login-button'));
    return;
  }
  const { sessionToken, profile } = user.user;
  const newComment = {
    ...formData,
    author: profile.id,
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
  const { data: postData, comments: { comments: postComments } } = post;
  if (postData && postData.id === formData.postId) {
    const newPostComments = [...postComments];
    newPostComments.unshift(newCommentData);
    if (newCommentData.parentId) {
      const parentIndex = newPostComments.findIndex(
        comment => comment.id === newCommentData.parentId
      );
      const parent = newPostComments[parentIndex];
      parent.children.unshift(newCommentData.id);
    }
    dispatch(postUpdateComments(newPostComments));
    dispatch(userAddComment(newCommentData.id));
  }
  return true;
};

export const commentDelete = commentId => async(dispatch, getState) => {
  const { user, post } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to delete comments.', 'footer-login-button'));
    return;
  }
  const { sessionToken } = user.user;
  const url = `${APIbaseURL}/${commentId}`;
  const deleted = await Requests.delete({
    url,
    headers: { sessionToken },
  });
  if (deleted.error) return;
  const { data: postData, comments: { comments: postComments } } = post;
  if (postData && postData.id === deleted.postId) {
    const newPostComments = [...postComments];
    const oldIndex = newPostComments.findIndex(comment => comment.id === commentId);
    newPostComments.splice(oldIndex, 1, deleted);
    await dispatch(postUpdateComments(newPostComments));
  }
};
