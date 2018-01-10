import { createSelector } from 'reselect';

const getSearchSelectedCriterion = ({ selectedCriterion }) => selectedCriterion;

const getSearchSortCriteria = ({ criteria }) => criteria;

export const getSearchCriteria = createSelector(
  [getSearchSelectedCriterion, getSearchSortCriteria],
  (criterion, criteria) => {
    let sortCriteria = criteria;
    if (criterion !== 'relevance') {
      sortCriteria = criteria.filter(({ value }) => value !== 'relevance');
    }
    return sortCriteria;
  }
);
