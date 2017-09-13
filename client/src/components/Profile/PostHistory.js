import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import FilterBar from '../FilterBar';
import PostPreview from '../Posts/PostPreview';
import {
  getUserSortedPosts,
  getUserPostsSortCriterion,
  getUserPostsSortDirection,
} from '../../selectors/user';
import {
  userPostsSelectSortCriterion,
} from '../../actions/user';

const PostHistory = ({
  width,
  posts,
  postVotesReceivedMax,
  postVotesReceivedSeries,
  selectSortCriterion,
  ...sortProps,
}) => (
  <Section responsive align="center" pad="small">
    <VotesMeter
      maxCount={postVotesReceivedMax}
      votesSeries={postVotesReceivedSeries}
    />
    <Box pad={{ vertical: 'none' }} className="user-details-list-container">
      <FilterBar
        width={width}
        selectSortCriterion={selectSortCriterion}
        {...sortProps}
      />
      <List>
        {
          posts.map((post, i) => <PostPreview key={`user-post-${i}`} width={width} {...post} />)
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
};

const mapStateToProps = ({ user }) => ({
  sortCriteria: user.sortCriteria,
  selectedCriterion: getUserPostsSortCriterion(user),
  sortDirection: getUserPostsSortDirection(user),
  posts: getUserSortedPosts(user),
});

export default connect(mapStateToProps, {
  selectSortCriterion: userPostsSelectSortCriterion,
})(PostHistory);
