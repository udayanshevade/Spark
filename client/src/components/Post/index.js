import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';
import PostPreview from '../Posts/PostPreview';
import Comments from '../Comments';
import { postGetDetails, postEmpty } from '../../actions/post';
import { profileSetUser } from '../../actions/profile';

class Post extends Component {
  componentDidMount() {
    this.props.actions.postGetDetails(this.props.match.params.id);
  }
  componentWillUnmount() {
    this.props.actions.postEmpty();
  }
  render() {
    const { data, width, actions } = this.props;
    if (!data) return <Box justify="center" className="loading-container"><Spinning /></Box>
    return (
      <Box direction="column" className="main-container">
        <PostPreview
          main
          width={width}
          profileSetUser={actions.profileSetUser}
          {...data}
        />
        <Comments />
      </Box>
    );
  }
}

const mapStateToProps = ({ post, responsive }) => ({
  width: responsive.width,
  data: post.data,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postGetDetails,
    profileSetUser,
    postEmpty,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
