import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layer from 'grommet/components/Layer';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Timestamp from 'grommet/components/Timestamp';
import VoteHistory from './VoteHistory';
import { userSetProfilePreviewActive } from '../../actions/user';
import {
  getUserName,
  getUserTimeSinceCreation,
  getUserVotesGivenHistory,
  getUserVotesGivenCount,
  getUserPostVotesReceived,
  getUserPostVotesReceivedCount,
  getUserCommentVotesReceived,
  getUserCommentVotesReceivedCount,
} from '../../selectors/user';

const Profile = ({
  actions,
  profilePreviewActive,
  username,
  userTimeSinceCreation,
  userVotesGivenMax,
  userVotesGivenSeries,
  userPostVotesReceivedSeries,
  userPostVotesReceivedMax,
  userCommentVotesReceivedSeries,
  userCommentVotesReceivedMax,
  height,
}) => {
  if (!username) return null;
  return (
    <Layer
      closer
      hidden={!profilePreviewActive}
      onClose={() => {
        actions.userSetProfilePreviewActive(false);
      }}
      className="profile-layer"
    >
      <Box
        pad={{ vertical: 'large', horizontal: 'none' }}
        direction="column"
        align="center"
      >
        <Heading tag="h3" strong className="profile-username-heading">{username}</Heading>
        <Label>User since <Timestamp fields="date" value={userTimeSinceCreation} /></Label>
        <VoteHistory
          height={height}
          postVotesReceivedMax={userPostVotesReceivedMax}
          postVotesReceivedSeries={userPostVotesReceivedSeries}
          commentVotesReceivedMax={userCommentVotesReceivedMax}
          commentVotesReceivedSeries={userCommentVotesReceivedSeries}
          votesGivenMax={userVotesGivenMax}
          votesGivenSeries={userVotesGivenSeries}
        />
      </Box>
    </Layer>
  );
};

Profile.propTypes = {
  actions: PropTypes.shape({
    userSetProfilePreviewActive: PropTypes.func,
  }),
  profilePreviewActive: PropTypes.bool,
  userVotesGivenMax: PropTypes.number,
  userVotesGivenSeries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  userTimeSinceCreation: PropTypes.string,
  height: PropTypes.number,
};

const mapStateToProps = ({ user, responsive }) => ({
  profilePreviewActive: user.profilePreviewActive,
  username: getUserName(user),
  userVotesGivenMax: getUserVotesGivenCount(user),
  userVotesGivenSeries: getUserVotesGivenHistory(user),
  userPostVotesReceivedMax: getUserPostVotesReceivedCount(user),
  userPostVotesReceivedSeries: getUserPostVotesReceived(user),
  userCommentVotesReceivedMax: getUserCommentVotesReceivedCount(user),
  userCommentVotesReceivedSeries: getUserCommentVotesReceived(user),
  userTimeSinceCreation: getUserTimeSinceCreation(user),
  height: responsive.height,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userSetProfilePreviewActive,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
