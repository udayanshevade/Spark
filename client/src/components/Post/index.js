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
import Comments from '../Comments';
import Loading from '../Loading';
import {
  postGetDetails,
  postToggleShowFull,
  postEmpty,
  postDelete,
} from '../../actions/post';
import { profileSetUser } from '../../actions/profile';
import { userRecordVote } from '../../actions/user';
import { getUsername, getUserVotesGiven } from '../../selectors/user';

class Post extends Component {
  componentDidMount() {
    this.props.actions.postGetDetails(this.props.match.params.id);
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
          votesGiven={votesGiven}
          username={username}
          {...data}
        />
        <Comments />
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
    userRecordVote,
    postDelete,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
