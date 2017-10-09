import { createSelector } from 'reselect';

export const getProfileData = profile => profile.user;
export const getProfileName = profile => profile.username;
export const getProfilePosts = profile => profile.posts.posts;
export const getProfilePostsSortCriterion = profile => profile.posts.selectedCriterion;
export const getProfilePostsSortDirection = profile => profile.posts.sortDirection;
export const getProfileComments = profile => profile.comments.comments;
export const getProfileCommentsSortCriterion = profile => profile.comments.selectedCriterion;
export const getProfileCommentsSortDirection = profile => profile.comments.sortDirection;

export const getProfileTimeSinceCreation = createSelector(
  getProfileData,
  profile => (profile ? (new Date(profile.created)).toISOString() : null)
);

export const getProfileVotesGivenHistory = createSelector(
  getProfileData,
  (profile) => {
    if (!profile) return null;
    const { votesGiven } = profile;
    const voteIds = Object.keys(votesGiven);
    const votesData = {
      upVote: {
        label: 'Upvotes',
        value: 0,
        colorIndex: 'accent-1',
      },
      downVote: {
        label: 'Downvotes',
        value: 0,
        colorIndex: 'accent-2',
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

export const getProfileVotesGivenCount = createSelector(
  getProfileVotesGivenHistory,
  voteHistory => (voteHistory ? voteHistory[0].value + voteHistory[1].value : null)
);

export const getProfileCommentVotesReceived = createSelector(
  getProfileData,
  (profile) => {
    if (!profile) return null;
    const { commentVotesReceived: votes } = profile;
    const series = [{
        label: 'Upvotes',
        value: Math.abs(votes.upVote),
        colorIndex: 'accent-1',
      }, {
        label: 'Downvotes',
        value: Math.abs(votes.downVote),
        colorIndex: 'accent-2',
    }];
    return series;
  }
);

export const getProfileCommentVotesReceivedCount = createSelector(
  getProfileData,
  profile => {
    if (!profile) return null;
    const { commentVotesReceived: votes } = profile;
    return Math.abs(votes.upVote) + Math.abs(votes.downVote);
  }
);

export const getProfileCommentsNetScore = createSelector(
  getProfileData,
  profile => {
    if (!profile) return null;
    const { commentVotesReceived: votes } = profile;
    const score = votes.upVote + votes.downVote;
    if (!score) {
      return score;
    } else if (score < 0) {
      return `-${score}`;
    } else {
      return `+${score}`;
    }
  }
);

export const getProfilePostVotesReceived = createSelector(
  getProfileData,
  (profile) => {
    if (!profile) return null;
    const { postVotesReceived: votes } = profile;
    const series = [{
        label: 'Upvotes',
        value: Math.abs(votes.upVote),
        colorIndex: 'accent-1',
      }, {
        label: 'Downvotes',
        value: Math.abs(votes.downVote),
        colorIndex: 'accent-2',
    }];
    return series;
  }
);

export const getProfilePostVotesReceivedCount = createSelector(
  getProfileData,
  profile => {
    if (!profile) return null;
    const { postVotesReceived: votes } = profile;
    return Math.abs(votes.upVote) + Math.abs(votes.downVote);
  }
);

export const getProfilePostsNetScore = createSelector(
  getProfileData,
  profile => {
    if (!profile) return null;
    const { postVotesReceived: votes } = profile;
    const score = votes.upVote + votes.downVote;
    if (!score) {
      return score;
    } else if (score < 0) {
      return `-${score}`;
    } else {
      return `+${score}`;
    }
  }
);
