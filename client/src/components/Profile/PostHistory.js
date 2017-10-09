import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Value from 'grommet/components/Value';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Loading from '../Loading';
import FilterBar from '../FilterBar';
import PostPreview from '../Posts/PostPreview';
import {
  getProfilePosts,
  getProfilePostsDepleted,
  getProfilePostsLoading,
  getProfilePostsSortCriterion,
  getProfilePostsSortDirection,
  getProfilePostsNetScore,
} from '../../selectors/profile';
import { getUsername, getUserVotesGiven } from '../../selectors/user';
import {
  profileGetPosts,
  profileSetUser,
  profilePostsSelectSortCriterion,
} from '../../actions/profile';
import { userRecordVote } from '../../actions/user';
import { postDelete, postUpdateCreateData } from '../../actions/post';

const PostHistory = ({
  width,
  posts,
  postVotesReceivedMax,
  postVotesReceivedSeries,
  actions,
  netScore,
  votesGiven,
  username,
  depleted,
  loading,
  ...sortProps,
}) => (
  <Section responsive align="center" pad="small">
    <Box
      direction="row"
      responsive
      align="center"
    >
      <Value value={netScore} label="score" className="profile-vote-score-value" />
      <VotesMeter
        maxCount={postVotesReceivedMax}
        votesSeries={postVotesReceivedSeries}
      />
    </Box>
    <Box pad={{ vertical: 'none' }} className="profile-details-list-container">
      <FilterBar
        width={width}
        selectSortCriterion={actions.selectSortCriterion}
        {...sortProps}
      />
      <List>
        {
          posts.map((post, i) => (
            <PostPreview
              key={`profile-post-${i}`}
              width={width}
              profileSetUser={actions.profileSetUser}
              applyVote={(id, vote) => {
                actions.applyVote('posts', id, vote);
              }}
              postDelete={actions.postDelete}
              postUpdateCreateData={actions.postUpdateCreateData}
              votesGiven={votesGiven}
              username={username}
              {...post}
            />
          ))
        }
      </List>
      {
        !(depleted || loading) &&
          <Footer justify="center">
            <Button
              plain
              label="Load more"
              onClick={() => {
                actions.profileGetPosts(username);
              }}
            />
          </Footer>
      }
      {
        loading && <Loading />
      }
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
  username: PropTypes.string,
};

const mapStateToProps = ({ user, profile }) => ({
  sortCriteria: profile.sortCriteria,
  depleted: getProfilePostsDepleted(profile),
  loading: getProfilePostsLoading(profile),
  selectedCriterion: getProfilePostsSortCriterion(profile),
  sortDirection: getProfilePostsSortDirection(profile),
  posts: getProfilePosts(profile),
  netScore: getProfilePostsNetScore(profile),
  votesGiven: getUserVotesGiven(user),
  username: getUsername(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    selectSortCriterion: profilePostsSelectSortCriterion,
    profileSetUser,
    applyVote: userRecordVote,
    postDelete,
    postUpdateCreateData,
    profileGetPosts,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostHistory);
