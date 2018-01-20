import { createSelector } from 'reselect';
import { getSortedList, getRestrictedList } from '../utils';

const getPostComments = post => post.comments.comments;
const getCommentId = (post, commentId) => commentId;
const getPostCommentsCriterion = post => post.comments.selectedCriterion;
const getPostCommentsDirection = post => post.comments.sortDirection;

export const getAncestorComments = createSelector(
  [getPostComments, getCommentId],
  (comments, commentId) => {
    if (commentId) return [commentId];
    const rootIds = comments.filter(comment => !comment.parentId).map(comment => comment.id);
    return rootIds;
  }
);

export const getRawComments = createSelector(
  getPostComments,
  (comments) => {
    const rawComments = {};
    for (const comment of comments) {
      rawComments[comment.id] = comment;
    }
    return rawComments;
  }
);

const structureComments = (rootIds, rawComments, criterion) => {
  const comments = [];
  for (const rootId of rootIds) {
    const comment = rawComments[rootId];
    if (!comment) break;
    const childCommentIds = comment.children;
    const newComment = {
      ...comment,
      children: structureComments(
        childCommentIds,
        rawComments,
        'best'
      ),
    };
    comments.push(newComment);
  }
  return getSortedList(comments, criterion);
};

export const getStructuredComments = createSelector(
  [
    getAncestorComments,
    getRawComments,
    getPostCommentsCriterion,
    getPostCommentsDirection,
  ],
  (ancestors, rawComments, criterion, direction) => {
    const structuredComments = structureComments(ancestors, rawComments, criterion);
    const orderedComments = getRestrictedList(structuredComments, direction);
    return orderedComments;
  }
);
