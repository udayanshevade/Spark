import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Spinning from 'grommet/components/icons/Spinning';
import Navbar from '../Navbar';
import PostPreview from './PostPreview';
import FilterBar from '../FilterBar';
import * as postsActions from '../../actions/posts';
import { searchSelectSortCriterion } from '../../actions/search';
import { profileSetUser } from '../../actions/profile';
import { getSortedPosts } from '../../selectors/posts';
import { userRecordVote } from '../../actions/user';
import { getUsername, getUserVotesGiven } from '../../selectors/user';

export const PostsComponent = ({
  width,
  loading,
  posts,
  actions,
  active,
  bodyCharLim,
  category,
  userRecordVote,
  votesGiven,
  username,
  ...filterProps,
}) => {
  let postsEl;
  if (loading) {
    postsEl = (
      <Box
        pad="large"
        align="center"
        className="loading-container"
      >
        <Spinning className="loading-spinner" />
      </Box>
    );
  } else if (!posts.length) {
    postsEl = (
      <ListPlaceHolder
        emptyMessage="No posts available."
        filteredTotal={posts.length}
        unfilteredTotal={posts.length}
      />
    );
  } else {
    postsEl = (
      <Section pad={{ vertical: 'none' }}>
        <FilterBar
          width={width}
          {...filterProps}
          selectSortCriterion={actions.searchSelectSortCriterion}
        />
        <Box pad={{ vertical: 'none' }} className="list-items-container">
          <List>
            {
              posts.map((post, i) => (
                <ListItem
                  key={`post-list-item-${i}`}
                  pad={{ horizontal: 'none' }}
                >
                  <PostPreview
                    width={width}
                    profileSetUser={actions.profileSetUser}
                    bodyCharLim={bodyCharLim}
                    applyVote={(id, vote) => {
                      actions.userRecordVote('posts', id, vote);
                    }}
                    votesGiven={votesGiven}
                    username={username}
                    {...post}
                  />
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Section>
    );
  }
  return (
    <div>
      <Navbar category={category}/>
      {postsEl}
    </div>
  );
}

PostsComponent.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ),
  actions: PropTypes.shape({
    postsSetActive: PropTypes.func,
  }),
  activePost: PropTypes.string,
  width: PropTypes.number,
  bodyCharLim: PropTypes.number,
};

const mapStateToProps = ({ user, posts, post, search, responsive }) => ({
  loading: posts.loading,
  posts: getSortedPosts({ posts, search }),
  active: posts.active,
  sortCriteria: search.criteria,
  sortDirection: search.sortDirection,
  selectedCriterion: search.selectedCriterion,
  width: responsive.width,
  bodyCharLim: post.bodyCharLim,
  votesGiven: getUserVotesGiven(user),
  username: getUsername(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...postsActions,
    searchSelectSortCriterion,
    profileSetUser,
    userRecordVote,
  }, dispatch),
});

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);

export default Posts;
