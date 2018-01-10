import { createSelector } from 'reselect';

const getUserDetails = user => user.user;

const getCurrentCategory = (user, category) => category;

const getUserProfile = createSelector(
  getUserDetails,
  details => (details ? details.profile : null)
); 

export const getUsername = createSelector(
  getUserProfile,
  profile => (profile ? profile.id : null)
);

export const getUserVotesGiven = createSelector(
  getUserProfile,
  profile => (profile ? profile.votesGiven : null)
);

export const getUserSubscriptions = createSelector(
  getUserDetails,
  details => (details ? details.subscriptions : null)
);

export const getUserSubscribed = createSelector(
  [getUserSubscriptions, getCurrentCategory],
  (subscriptions, currentCategory) => (
    subscriptions
      ? subscriptions.indexOf(currentCategory) > -1
      : null
  )
);
