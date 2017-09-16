import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Value from 'grommet/components/Value';
import FilterBar from '../FilterBar';
import PostPreview from '../Posts/PostPreview';
import {
  getProfileSortedPosts,
  getProfilePostsSortCriterion,
  getProfilePostsSortDirection,
  getProfilePostsNetScore,
} from '../../selectors/profile';
import { getUserVotesGiven } from '../../selectors/user';
import {
  profileSetUser,
  profilePostsSelectSortCriterion,
} from '../../actions/profile';
import { userRecordVote } from '../../actions/user';

const PostHistory = ({
  width,
  posts,
  postVotesReceivedMax,
  postVotesReceivedSeries,
  selectSortCriterion,
  netScore,
  setUser,
  applyVote,
  votesGiven,
  ...sortProps,
}) => (
  <Section responsive align="center" pad="small">
    <Box
      direction="row"
      responsive
      align="center"
    >
      <Value value={netScore} label="score" className="user-vote-score-value" />
      <VotesMeter
        maxCount={postVotesReceivedMax}
        votesSeries={postVotesReceivedSeries}
      />
    </Box>
    <Box pad={{ vertical: 'none' }} className="user-details-list-container">
      <FilterBar
        width={width}
        selectSortCriterion={selectSortCriterion}
        {...sortProps}
      />
      <List>
        {
          posts.map((post, i) => (
            <PostPreview
              key={`user-post-${i}`}
              width={width}
              profileSetUser={setUser}
              applyVote={(id, vote) => {
                applyVote('posts', id, vote);
              }}
              votesGiven={votesGiven}
              {...post}
            />
          ))
        }
      </List>
    </Box>
  </Section>
);

const seriesProps = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  }),
);

const postProps = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
  }),
);

PostHistory.propTypes = {
  width: PropTypes.number,
  postVotesReceivedSeries: seriesProps,
  postVotesReceivedMax: PropTypes.number,
  posts: postProps,
  netScore: PropTypes.string,
};

const mapStateToProps = ({ user, profile }) => ({
  sortCriteria: profile.sortCriteria,
  selectedCriterion: getProfilePostsSortCriterion(profile),
  sortDirection: getProfilePostsSortDirection(profile),
  posts: getProfileSortedPosts(profile),
  netScore: getProfilePostsNetScore(profile),
  votesGiven: getUserVotesGiven(user),
});

export default connect(mapStateToProps, {
  selectSortCriterion: profilePostsSelectSortCriterion,
  setUser: profileSetUser,
  applyVote: userRecordVote,
})(PostHistory);
