import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import FilterBar from '../FilterBar';
import CommentPreview from '../Comments/CommentPreview';
import {
  getUserSortedComments,
  getUserCommentsSortCriterion,
  getUserCommentsSortDirection,
} from '../../selectors/user';
import {
  userCommentsSelectSortCriterion,
} from '../../actions/user';

const CommentHistory = ({
  width,
  comments,
  commentVotesReceivedMax,
  commentVotesReceivedSeries,
  selectSortCriterion,
  ...sortProps,
}) => (
  <Section responsive align="center" pad="small">
    <VotesMeter
      maxCount={commentVotesReceivedMax}
      votesSeries={commentVotesReceivedSeries}
    />
    <Box pad={{ vertical: 'none' }} className="user-details-list-container">
      <FilterBar
        width={width}
        selectSortCriterion={selectSortCriterion}
        {...sortProps}
      />
      <List>
        {
          comments.map((post, i) => <CommentPreview key={`user-post-${i}`} width={width} {...post} />)
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
};

const mapStateToProps = ({ user }) => ({
  sortCriteria: user.sortCriteria,
  selectedCriterion: getUserCommentsSortCriterion(user),
  sortDirection: getUserCommentsSortDirection(user),
  comments: getUserSortedComments(user),
});

export default connect(mapStateToProps, {
  selectSortCriterion: userCommentsSelectSortCriterion,
})(CommentHistory);
