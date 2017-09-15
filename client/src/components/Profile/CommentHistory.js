import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Value from 'grommet/components/Value';
import FilterBar from '../FilterBar';
import CommentPreview from '../Comments/CommentPreview';
import {
  getProfileSortedComments,
  getProfileCommentsSortCriterion,
  getProfileCommentsSortDirection,
  getProfileCommentsNetScore,
} from '../../selectors/profile';
import {
  profileSetUser,
  profileCommentsSelectSortCriterion,
} from '../../actions/profile';

const CommentHistory = ({
  width,
  comments,
  commentVotesReceivedMax,
  commentVotesReceivedSeries,
  selectSortCriterion,
  netScore,
  setUser,
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
        maxCount={commentVotesReceivedMax}
        votesSeries={commentVotesReceivedSeries}
      />
    </Box>
    <Box pad={{ vertical: 'none' }} className="profile-details-list-container">
      <FilterBar
        width={width}
        selectSortCriterion={selectSortCriterion}
        {...sortProps}
      />
      <List>
        {
          comments.map((post, i) => (
            <ListItem key={`profile-post-${i}`}>
              <CommentPreview
                width={width}
                profileSetUser={setUser}
                {...post}
              />
            </ListItem>
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

const commentProps = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
  }),
);

CommentHistory.propTypes = {
  width: PropTypes.number,
  commentVotesReceivedSeries: seriesProps,
  commentVotesReceivedMax: PropTypes.number,
  comments: commentProps,
  netScore: PropTypes.string,
};

const mapStateToProps = ({ profile }) => ({
  sortCriteria: profile.sortCriteria,
  selectedCriterion: getProfileCommentsSortCriterion(profile),
  sortDirection: getProfileCommentsSortDirection(profile),
  comments: getProfileSortedComments(profile),
  netScore: getProfileCommentsNetScore(profile),
});

export default connect(mapStateToProps, {
  selectSortCriterion: profileCommentsSelectSortCriterion,
  setUser: profileSetUser,
})(CommentHistory);
