import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import MoreIcon from 'grommet/components/icons/base/More';
import PostPreview from '../Posts/PostPreview';
import NewComment from '../UpdateComment/NewComment';
import Comments from '../Comments';
import Loading from '../Loading';
import {
  postGetDetails,
  postToggleShowFull,
  postEmpty,
  postSetLoading,
  postDelete,
  postUpdateCreateData,
} from '../../actions/post';
import { profileSetUser } from '../../actions/profile';
import { userRecordVote } from '../../actions/user';
import { getUsername, getUserVotesGiven } from '../../selectors/user';
import { getRandomID } from '../../utils';

class Post extends Component {
  blankComment = {
    body: '',
    parentId: null,
    ancestorId: null,
  }
  
  newCommentId = getRandomID()

  componentDidMount() {
    const { data, match } = this.props;
    if (!(data && data.id === match.params.id)) {
      this.props.actions.postGetDetails(this.props.match.params.id);
    } else {
      this.props.actions.postSetLoading(false);
    }
  }
  componentWillUnmount() {
    this.props.actions.postEmpty();
  }
  render() {
    const {
      data,
      width,
      actions,
      navbarTitle,
      showFull,
      bodyCharLim,
      votesGiven,
      loading,
      username,
    } = this.props;
    if (loading) {
      return <Loading />;
    } else if (!data) {
      return <Redirect to="/" />;
    }
    const { category } = data;
    return (
      <Box direction="column" className="post-container">
        <Header
          pad={{ horizontal: 'small' }}
          className="post-header"
          size="small"
        >
           <Title className="app-header__title" responsive={false}>
            <Anchor path="/"><span>{navbarTitle}</span></Anchor>
          </Title>
          <MoreIcon size="small" className="header-arrow-icon" />
          <Heading tag="h3" className="post-heading">
            <Anchor path={`/categories/${category}`}>
              /{category}
            </Anchor>
          </Heading>
        </Header>
        <PostPreview
          main
          width={width}
          bodyCharLim={bodyCharLim}
          profileSetUser={actions.profileSetUser}
          threadView
          toggleShowFull={actions.postToggleShowFull}
          showFull={showFull}
          applyVote={(id, vote) => {
            actions.userRecordVote('posts', id, vote);
          }}
          postDelete={actions.postDelete}
          postUpdateCreateData={actions.postUpdateCreateData}
          votesGiven={votesGiven}
          username={username}
          {...data}
        />
        <NewComment
          randomFormID={this.newCommentId}
          postId={data.id}
          initialValues={this.blankComment}
        />
        <Comments threadView />
      </Box>
    );
  }
}

const mapStateToProps = ({ user, post, responsive, navbar }) => ({
  width: responsive.width,
  data: post.data,
  loading: post.loading,
  showFull: post.showFull,
  navbarTitle: navbar.title,
  bodyCharLim: post.bodyCharLim,
  votesGiven: getUserVotesGiven(user),
  username: getUsername(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postGetDetails,
    profileSetUser,
    postToggleShowFull,
    postEmpty,
    postSetLoading,
    userRecordVote,
    postDelete,
    postUpdateCreateData,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
