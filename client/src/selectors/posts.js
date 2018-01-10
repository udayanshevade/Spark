import { createSelector } from 'reselect';

const getPostsData = ({ posts }) => posts.posts;
const getSelectedCriterion = ({ search }) => search.selectedCriterion;
const getSortDirection = ({ search }) => search.sortDirection;

export const getSortedPosts = createSelector(
  [getPostsData, getSelectedCriterion, getSortDirection],
  (posts, criterion, direction) => {
    let sortedPosts = posts;
    if (criterion === 'relevance') {
      if (direction === 'asc') {
        sortedPosts = [...posts].reverse();
      }
    } else {
      switch (direction) {
        case 'asc':
          sortedPosts = [...posts].sort((a, b) => a[criterion] - b[criterion]);
          break;
        case 'desc':
          sortedPosts = [...posts].sort((a, b) => b[criterion] - a[criterion]);
          break;
        default:
          break;
      }
    }
    return sortedPosts;
  }
);
