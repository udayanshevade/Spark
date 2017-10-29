import { createSelector } from 'reselect';

const getPostComments = post => post.comments.comments;

export const getAncestorComments = createSelector(
  getPostComments,
  comments => {
    const ancestorIds = comments.filter(comment => !comment.ancestorId).map(comment => comment.id);
    return ancestorIds;
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

const structureComments = (ancestorIds, rawComments) => {
  const comments = [];
  for (const ancestorId of ancestorIds) {
    const comment = rawComments[ancestorId];
    if (!comment) break;
    const childCommentIds = comment.children;
    const newComment = {
      ...comment,
      children: structureComments(
        childCommentIds,
        rawComments
      ),
    };
    comments.push(newComment);
  }
  return comments;
};

export const getStructuredComments = createSelector(
  [getAncestorComments, getRawComments],
  (ancestors, rawComments) => {
    const sortedComments = structureComments(ancestors, rawComments);
    return sortedComments;
  }
);
