import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Timestamp from 'grommet/components/Timestamp';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import VoteHistory from './VoteHistory';
import PostHistory from './PostHistory';
import CommentHistory from './CommentHistory';
import Loading from '../Loading';
import {
  getProfileData,
  getProfileName,
  getProfileTimeSinceCreation,
  getProfileVotesGivenHistory,
  getProfileVotesGivenCount,
  getProfilePostVotesReceived,
  getProfilePostVotesReceivedCount,
  getProfileCommentVotesReceived,
  getProfileCommentVotesReceivedCount,
} from '../../selectors/profile';

const ProfileDetails = ({
  data,
  loading,
  width,
  height,
  username,
  timeSinceCreation,
  postVotesReceivedMax,
  postVotesReceivedSeries,
  commentVotesReceivedMax,
  commentVotesReceivedSeries,
  votesGivenMax,
  votesGivenSeries,
}) => (
  !data || loading
  ? <Loading />
  : (
      <Box
        pad={{ vertical: 'large', horizontal: 'none' }}
        direction="column"
        align="center"
      >
        <Heading tag="h3" strong className="profile-username-heading">{username}</Heading>
        <Label>User since <Timestamp fields="date" value={timeSinceCreation} /></Label>
        <Tabs responsive>
          <Tab title="Votes">
            <VoteHistory
              height={height}
              votesGivenMax={votesGivenMax}
              votesGivenSeries={votesGivenSeries}
              postVotesReceivedMax={postVotesReceivedMax}
              postVotesReceivedSeries={postVotesReceivedSeries}
              commentVotesReceivedMax={commentVotesReceivedMax}
              commentVotesReceivedSeries={commentVotesReceivedSeries}
            />
          </Tab>
          <Tab title="Posts">
            <PostHistory
              width={width}
              postVotesReceivedMax={postVotesReceivedMax}
              postVotesReceivedSeries={postVotesReceivedSeries}
            />
          </Tab>
          <Tab title="Comments">
            <CommentHistory
              width={width}
              commentVotesReceivedMax={commentVotesReceivedMax}
              commentVotesReceivedSeries={commentVotesReceivedSeries}
            />
          </Tab>
        </Tabs>
      </Box>
    )
);

ProfileDetails.propTypes = {
  username: PropTypes.string,
  timeSinceCreation: PropTypes.string,
};

const mapStateToProps = ({ profile, responsive }) => ({
  loading: profile.loading,
  data: getProfileData(profile),
  username: getProfileName(profile),
  timeSinceCreation: getProfileTimeSinceCreation(profile),
  votesGivenMax: getProfileVotesGivenCount(profile),
  votesGivenSeries: getProfileVotesGivenHistory(profile),
  postVotesReceivedMax: getProfilePostVotesReceivedCount(profile),
  postVotesReceivedSeries: getProfilePostVotesReceived(profile),
  commentVotesReceivedMax: getProfileCommentVotesReceivedCount(profile),
  commentVotesReceivedSeries: getProfileCommentVotesReceived(profile),
  height: responsive.height,
  width: responsive.width,
});

export default connect(mapStateToProps)(ProfileDetails);
