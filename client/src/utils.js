const milsToHours = 3600000;
const timeFactor = 2;

export const getRandomID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

/**
 * @description Function that returns confidence-weighted rating
 * @param {number} pos - positive upvotes
 * @param {number} n - total votes
 */
 const getConfidenceWeight = (pos, n) => {
  const z = 1.96;
  const z2 = z * z;
  const phat = pos / n;
  return (
    (
      (phat + (z2 / (2 * n)))
      - (
          z * Math.sqrt(
                (
                  (phat * (1 - phat))
                  + (z2 / (4 * n))
                ) / n
              )
        )
    )
    / (1 + (z2 / n))
  );
};

/**
 * @description Returns weighted collection
 * @param {array} unsorted - raw array of items to sort
 */
const getWeightedSort = (unsorted) => {
  const sorted = unsorted.sort((
    { votes: { upVote: aUpVote, downVote: aDownVote }},
    { votes: { upVote: bUpVote, downVote: bDownVote }}
  ) => {
    const aAllVotes = aUpVote + aDownVote;
    const bAllVotes = bUpVote + bDownVote;
    const aWeightedScore = getConfidenceWeight(aUpVote, aAllVotes);
    const bWeightedScore = getConfidenceWeight(bUpVote, bAllVotes);
    return bWeightedScore - aWeightedScore;
  });
  return sorted;
};

/**
 * @description Returns collection
 * @param {array} unsorted - raw array of items to sort
 */
const getHotSort = (unsorted) => {
  const sorted = unsorted.sort((
    { id: aId, created: aCreated, votes: { upVote: aUpVote, downVote: aDownVote }},
    { id: bId, created: bCreated, votes: { upVote: bUpVote, downVote: bDownVote }}
  ) => {
    const aAllVotes = aUpVote + aDownVote;
    const bAllVotes = bUpVote + bDownVote;
    const now = Date.now();
    const aLapsed = (now - new Date(aCreated)) / milsToHours;
    const bLapsed = (now - new Date(bCreated)) / milsToHours;
    const aWeightedScore = getConfidenceWeight(aUpVote, aAllVotes) + (1 / Math.pow(aLapsed + 2, timeFactor));
    const bWeightedScore = getConfidenceWeight(bUpVote, bAllVotes) + (1 / Math.pow(bLapsed + 2, timeFactor));
    return bWeightedScore - aWeightedScore;
  });
  return sorted;
};

/**
 * @description Get sorted post items
 */
export const getSortedList = (list, criterion) => {
  let sorted;
  switch (criterion) {
    case 'score': {
      sorted = list.sort((a, b) => {
        const aVoteScore = a.votes.upVote - a.votes.downVote;
        const bVoteScore = b.votes.upVote - b.votes.downVote;
        return bVoteScore - aVoteScore;
      });
      break;
    }
    case 'new': {
      sorted = list.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    }
    case 'best': {
      sorted = getWeightedSort(list);
      break;
    }
    case 'hot': {
      sorted = getHotSort(list);
      break;
    }
    default: {
      sorted = list;
    }
  }
  return sorted;
};

/**
 * @description Get limited post items
 */
export const getRestrictedList = (list, direction) => 
  direction === 'desc'
    ? list
    : [...list].reverse();