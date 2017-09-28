import { createSelector } from 'reselect';

export const getViewportWidth = responsive => responsive.width;

export const getViewportHeight = responsive => responsive.height;

const viewportLimits = {
  xs: 321,
  sm: 500,
  md: 698,
  lg: 882,
  xl: 1000,
};

export const getIsTiny = createSelector(
  getViewportWidth,
  width => width < viewportLimits.xs
);

export const getIsMobile = createSelector(
  getViewportWidth,
  width => width < viewportLimits.sm
);
