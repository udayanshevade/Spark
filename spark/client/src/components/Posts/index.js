import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import FlipMove from 'react-flip-move';
import Navbar from '../Navbar';
import PostPreview from './PostPreview';
import FilterBar from '../FilterBar';
import Loading from '../Loading';
import * as postsActions from '../../actions/posts';
import { searchSelectSortCriterion } from '../../actions/search';
import { profileSetUser } from '../../actions/profile';
import { postDelete, postUpdateCreateData } from '../../actions/post';
import { userRecordVote } from '../../actions/user';
import { getUsername, getUserVotesGiven } from '../../selectors/user';
import { getSearchCriteria } from '../../selectors/search';

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
  query,
  depleted,
  ...filterProps,
}) => {
  let postsEl;
  if (loading && !posts.length) {
    postsEl = <Loading />;
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
          category={category}
          width={width}
          {...filterProps}
          selectSortCriterion={actions.searchSelectSortCriterion}
        />
        <Box pad={{ vertical: 'none' }} className="list-items-container">
          <List>
            <FlipMove
              duration={350}
              easing="ease-in-out"
              typeName={null}
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
            >
              {
                posts.map((post, i) => (
                  <ListItem
                    key={`post-list-item-${post.id}`}
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
                      postDelete={actions.postDelete}
                      postUpdateCreateData={actions.postUpdateCreateData}
                      {...post}
                    />
                  </ListItem>
                ))
              }
            </FlipMove>
          </List>
          {
            !(depleted || loading) &&
              <Footer justify="center">
                <Button
                  plain
                  label="Load more"
                  onClick={() => {
                    actions.postsLoadData(query, category);
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
  depleted: posts.depleted,
  posts: posts.posts,
  active: posts.active,
  sortCriteria: getSearchCriteria(search),
  query: posts.query,
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
    postDelete,
    postUpdateCreateData,
  }, dispatch),
});

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);

export default Posts;
