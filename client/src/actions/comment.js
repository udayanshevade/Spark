import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { postUpdateComments } from './post';
import { userAddComment } from './user';

const APIbaseURL = '/comments';

export const commentUpdateBody = body => ({
  type: types.COMMENT_UPDATE_BODY,
  body,
});

export const commentUpdate = formData => async(dispatch, getState) => {
  const { user, post } = getState();
  if (!user.user) {
    appShowTipWithText('Login to edit comments.', 'footer-login-button');
    return;
  }
  const {
    postId,
    id,
    ...newComment,
  } = formData;
  const { sessionToken } = user.user;
  const url = `${APIbaseURL}/${id}/edit`;
  const newCommentData = await Requests.put({
    url,
    headers: { sessionToken },
    body: newComment,
  });
  if (newCommentData.error) return false;
  const { data: postData, comments: postComments } = post;
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
    appShowTipWithText('Login to submit comments.', 'footer-login-button');
    return;
  }
  const { sessionToken, profile } = user.user;
  const newComment = {
    ...formData,
    author: profile.id,
  };
  const newCommentData = await Requests.post({
    url: APIbaseURL,
    headers: { sessionToken },
    body: newComment,
  });
  if (newCommentData.error) return false;
  const { data: postData, comments: postComments } = post;
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
    await dispatch(postUpdateComments(newPostComments));
    await dispatch(userAddComment(newCommentData.id));
  }
  return true;
};
