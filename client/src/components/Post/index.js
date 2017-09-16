import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';
import MoreIcon from 'grommet/components/icons/base/More';
import PostPreview from '../Posts/PostPreview';
import Comments from '../Comments';
import { postGetDetails, postToggleShowFull, postEmpty } from '../../actions/post';
import { profileSetUser } from '../../actions/profile';
import { userRecordVote } from '../../actions/user';
import { getUserVotesGiven } from '../../selectors/user';

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
    } = this.props;
    if (!data) return <Box justify="center" className="loading-container"><Spinning /></Box>
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
          votesGiven={votesGiven}
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
  showFull: post.showFull,
  navbarTitle: navbar.title,
  bodyCharLim: post.bodyCharLim,
  votesGiven: getUserVotesGiven(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postGetDetails,
    profileSetUser,
    postToggleShowFull,
    postEmpty,
    userRecordVote,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
