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
  getProfilePostsVotesReceived,
  getProfilePostsVotesReceivedCount,
  getProfileCommentsVotesReceived,
  getProfileCommentsVotesReceivedCount,
} from '../../selectors/profile';

const ProfileDetails = ({
  data,
  loading,
  width,
  height,
  username,
  timeSinceCreation,
  postsVotesReceivedMax,
  postsVotesReceivedSeries,
  commentsVotesReceivedMax,
  commentsVotesReceivedSeries,
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
              postsVotesReceivedMax={postsVotesReceivedMax}
              postsVotesReceivedSeries={postsVotesReceivedSeries}
              commentsVotesReceivedMax={commentsVotesReceivedMax}
              commentsVotesReceivedSeries={commentsVotesReceivedSeries}
            />
          </Tab>
          <Tab title="Posts">
            <PostHistory
              width={width}
              postsVotesReceivedMax={postsVotesReceivedMax}
              postsVotesReceivedSeries={postsVotesReceivedSeries}
            />
          </Tab>
          <Tab title="Comments">
            <CommentHistory
              width={width}
              commentsVotesReceivedMax={commentsVotesReceivedMax}
              commentsVotesReceivedSeries={commentsVotesReceivedSeries}
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
  postsVotesReceivedMax: getProfilePostsVotesReceivedCount(profile),
  postsVotesReceivedSeries: getProfilePostsVotesReceived(profile),
  commentsVotesReceivedMax: getProfileCommentsVotesReceivedCount(profile),
  commentsVotesReceivedSeries: getProfileCommentsVotesReceived(profile),
  height: responsive.height,
  width: responsive.width,
});

export default connect(mapStateToProps)(ProfileDetails);
