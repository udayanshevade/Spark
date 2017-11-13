import { createSelector } from 'reselect';

const getCategoryData = (categories, category) => categories.find(
  ({ name }) => name === category
);

export const getCategoryBlurb = createSelector(
  getCategoryData,
  (data) => data ? data.blurb : null
);

export const getCategoryCreator = createSelector(
  getCategoryData,
  (data) => data ? data.creator : null
);

export const getCategorySubscribers = createSelector(
  getCategoryData,
  (data) => data ? data.subscribers : null
);
