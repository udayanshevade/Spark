import { createSelector } from 'reselect';

const getUserDetails = user => user.user; 

const getUserProfile = createSelector(
  getUserDetails,
  details => (details ? details.profile : null)
); 

export const getUsername = createSelector(
  getUserProfile,
  profile => (profile ? profile.id : null)
);
