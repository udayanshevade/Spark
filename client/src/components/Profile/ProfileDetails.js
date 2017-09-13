import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
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
import { userGetActivity } from '../../actions/user';

class ProfileDetails extends Component {
  componentDidMount() {
    this.props.actions.userGetActivity(this.props.username);
  }
  render () {
    const {
      width,
      height,
      username,
      userPosts,
      timeSinceCreation,
      postVotesReceivedMax,
      postVotesReceivedSeries,
      commentVotesReceivedMax,
      commentVotesReceivedSeries,
      votesGivenMax,
      votesGivenSeries,
    } = this.props;
    return (
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
              userPosts={userPosts}
              postVotesReceivedMax={postVotesReceivedMax}
              postVotesReceivedSeries={postVotesReceivedSeries}
            />
          </Tab>
          <Tab title="Comments">
            <CommentHistory
              width={width}
              userComments={userPosts}
              commentVotesReceivedMax={commentVotesReceivedMax}
              commentVotesReceivedSeries={commentVotesReceivedSeries}
            />
          </Tab>
        </Tabs>
      </Box>
    );
  }
}

ProfileDetails.propTypes = {
  username: PropTypes.string,
  timeSinceCreation: PropTypes.string,
};

const mapStateToProps = ({ user, responsive }) => ({
  username: getUserName(user),
  timeSinceCreation: getUserTimeSinceCreation(user),
  votesGivenMax: getUserVotesGivenCount(user),
  votesGivenSeries: getUserVotesGivenHistory(user),
  postVotesReceivedMax: getUserPostVotesReceivedCount(user),
  postVotesReceivedSeries: getUserPostVotesReceived(user),
  commentVotesReceivedMax: getUserCommentVotesReceivedCount(user),
  commentVotesReceivedSeries: getUserCommentVotesReceived(user),
  height: responsive.height,
  width: responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userGetActivity,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);
