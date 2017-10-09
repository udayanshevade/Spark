import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Value from 'grommet/components/Value';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Loading from '../Loading';
import FilterBar from '../FilterBar';
import CommentPreview from '../Comments/CommentPreview';
import {
  getProfileComments,
  getProfileCommentsDepleted,
  getProfileCommentsLoading,
  getProfileCommentsSortCriterion,
  getProfileCommentsSortDirection,
  getProfileCommentsNetScore,
} from '../../selectors/profile';
import { getUsername, getUserVotesGiven } from '../../selectors/user';
import {
  profileGetComments,
  profileSetUser,
  profileCommentsSelectSortCriterion,
} from '../../actions/profile';
import { userRecordVote } from '../../actions/user';

const CommentHistory = ({
  width,
  comments,
  commentVotesReceivedMax,
  commentVotesReceivedSeries,
  selectSortCriterion,
  netScore,
  setUser,
  applyVote,
  votesGiven,
  username,
  depleted,
  loading,
  getComments,
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
            <ListItem key={`profile-comment-${i}`}>
              <CommentPreview
                width={width}
                profileSetUser={setUser}
                applyVote={(id, vote) => {
                  applyVote('comments', id, vote);
                }}
                votesGiven={votesGiven}
                username={username}
                {...post}
              />
            </ListItem>
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
                getComments(username);
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
  username: PropTypes.string,
};

const mapStateToProps = ({ user, profile }) => ({
  sortCriteria: profile.sortCriteria,
  depleted: getProfileCommentsDepleted(profile),
  loading: getProfileCommentsLoading(profile),
  selectedCriterion: getProfileCommentsSortCriterion(profile),
  sortDirection: getProfileCommentsSortDirection(profile),
  comments: getProfileComments(profile),
  netScore: getProfileCommentsNetScore(profile),
  votesGiven: getUserVotesGiven(user),
  username: getUsername(user),
});

export default connect(mapStateToProps, {
  selectSortCriterion: profileCommentsSelectSortCriterion,
  setUser: profileSetUser,
  applyVote: userRecordVote,
  getComments: profileGetComments,
})(CommentHistory);
