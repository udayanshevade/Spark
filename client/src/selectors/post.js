import { createSelector } from 'reselect';

const getPostComments = post => post.comments;

const getPostSortCriterion = post => post.selectedCriterion;
const getPostSortDirection = post => post.sortDirection;

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
    const childCommentIds = comment.children;
    const newComment = { ...comment, children: structureComments(childCommentIds, rawComments) };
    comments.push(newComment);
  }
  return comments;
};

const getNestedComments = createSelector(
  [getAncestorComments, getRawComments],
  (ancestors, rawComments) => {
    const nestedComments = structureComments(ancestors, rawComments);
    return nestedComments;
  }
);

export const getSortedComments = createSelector(
  [getNestedComments, getPostSortCriterion, getPostSortDirection],
  (comments, criterion, direction) => {
    switch (direction) {
      case 'asc': {
        return [...comments].sort((a, b) => a[criterion] - b[criterion]);
      }
      case 'desc': {
        return [...comments].sort((a, b) => b[criterion] - a[criterion]);
      }
      default:
        return comments;
    }
  }
);
