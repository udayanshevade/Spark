export const determineVoteDelta = (option, previousVote) => {
  let delta = 0;
  if ((!previousVote && option === 'upVote') ||
    (!option && previousVote === 'downVote')) {
    delta = 1;
  } else if ((!previousVote && option === 'downVote') ||
    (!option && previousVote === 'upVote')) {
    delta = -1;
  } else if (previousVote === 'downVote' && option ==='upVote') {
    delta = 2;
  } else if (previousVote === 'upVote' && option === 'downVote') {
    delta = -2;
  }
  return delta;
};
