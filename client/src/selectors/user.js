import { createSelector } from 'reselect';

export const getUserData = user => user ? user.user : null;

export const getUserPosts = user => user.posts;
export const getUserPostsSortCriterion = user => user.postsSelectedCriterion;
export const getUserPostsSortDirection = user => user.postsSortDirection;
export const getUserComments = user => user.comments;
export const getUserCommentsSortCriterion = user => user.commentsSelectedCriterion;
export const getUserCommentsSortDirection = user => user.commentsSortDirection;

export const getUserSortedPosts = createSelector(
  [getUserPosts, getUserPostsSortDirection, getUserPostsSortCriterion],
  (posts, direction, criterion) => (
    direction === 'asc'
      ? [...posts].sort((a, b) => a[criterion] - b[criterion])
      : [...posts].sort((a, b) => b[criterion] - a[criterion])
));

export const getUserSortedComments = createSelector(
  [getUserComments, getUserCommentsSortDirection, getUserCommentsSortCriterion],
  (comments, direction, criterion) => (
    direction === 'asc'
      ? [...comments].sort((a, b) => a[criterion] - b[criterion])
      : [...comments].sort((a, b) => b[criterion] - a[criterion])
));

export const getUserProfile = createSelector(
  getUserData,
  data => (data ? data.profile : null)
);

export const getUserName = createSelector(
  getUserProfile,
  profile => (profile ? profile.id : null)
);

export const getUserTimeSinceCreation = createSelector(
  getUserProfile,
  profile => (profile ? (new Date(profile.created)).toISOString() : null)
);

export const getUserVotesGivenHistory = createSelector(
  getUserProfile,
  (profile) => {
    if (!profile) return null;
    const { votesGiven } = profile;
    const voteIds = Object.keys(votesGiven);
    const votesData = {
      upVote: {
        label: 'Upvotes',
        value: 0,
        colorIndex: 'ok',
      },
      downVote: {
        label: 'Downvotes',
        value: 0,
        colorIndex: 'critical',
      },
    };
    if (voteIds.length) {
      for (const voteId of voteIds) {
        const vote = votesGiven[voteId];
        votesData[vote].value += 1;
      }
    }
    const series = Object.keys(votesData).map(type => votesData[type]);
    return series;
  }
);

export const getUserVotesGivenCount = createSelector(
  getUserVotesGivenHistory,
  voteHistory => (voteHistory ? voteHistory[0].value + voteHistory[1].value : null)
);

export const getUserCommentVotesReceived = createSelector(
  getUserProfile,
  (profile) => {
    if (!profile) return null;
    const { commentVotesReceived: votes } = profile;
    const series = [{
        label: 'Upvotes',
        value: Math.abs(votes.upVote),
        colorIndex: 'ok',
      }, {
        label: 'Downvotes',
        value: Math.abs(votes.downVote),
        colorIndex: 'critical',
    }];
    return series;
  }
);

export const getUserCommentVotesReceivedCount = createSelector(
  getUserCommentVotesReceived,
  voteHistory => (voteHistory ? voteHistory[0].value + voteHistory[1].value : null)
);

export const getUserPostVotesReceived = createSelector(
  getUserProfile,
  (profile) => {
    if (!profile) return null;
    const { postVotesReceived: votes } = profile;
    const series = [{
        label: 'Upvotes',
        value: Math.abs(votes.upVote),
        colorIndex: 'ok',
      }, {
        label: 'Downvotes',
        value: Math.abs(votes.downVote),
        colorIndex: 'critical',
    }];
    return series;
  }
);

export const getUserPostVotesReceivedCount = createSelector(
  getUserPostVotesReceived,
  voteHistory => (voteHistory ? voteHistory[0].value + voteHistory[1].value : null)
);
