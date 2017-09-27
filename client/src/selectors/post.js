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

const structureComments = (ancestorIds, rawComments, criterion, direction) => {
  const comments = [];
  let sortedAncestorIds;
  switch (direction) {
    case 'asc':
      sortedAncestorIds = [...ancestorIds].sort(
        (a, b) => rawComments[a][criterion] - rawComments[b][criterion]
      );
      break;
    case 'desc':
      sortedAncestorIds = [...ancestorIds].sort(
        (a, b) => rawComments[b][criterion] - rawComments[a][criterion]
      );
      break;
    default:
      sortedAncestorIds = ancestorIds;
  }

  for (const ancestorId of sortedAncestorIds) {
    const comment = rawComments[ancestorId];
    const childCommentIds = comment.children;
    const newComment = {
      ...comment,
      children: structureComments(
        childCommentIds,
        rawComments,
        criterion,
        direction
      ),
    };
    comments.push(newComment);
  }
  return comments;
};

export const getSortedComments = createSelector(
  [getAncestorComments, getRawComments, getPostSortCriterion, getPostSortDirection],
  (ancestors, rawComments, criterion, direction) => {
    const sortedComments = structureComments(ancestors, rawComments, criterion, direction);
    return sortedComments;
  }
);
