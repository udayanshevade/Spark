import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Spinning from 'grommet/components/icons/Spinning';
import PostPreview from './PostPreview';
import FilterBar from '../FilterBar';
import * as postsActions from '../../actions/posts';
import { selectSortedPosts } from '../../selectors/posts';

export const PostsComponent = ({ width, loading, posts, actions, active }) => {
  let postsEl;
  if (loading) {
    postsEl = <Spinning className="loading-spinner" />
  } else if (!posts.length) {
    postsEl = (
      <ListPlaceHolder
        filteredTotal={posts.length}
      />
    );
  } else {
    postsEl = (
      <Section>
        <FilterBar />
        <Box pad={{ vertical: 'medium' }}>
          <List>
            {
              posts.map((post, i) => <PostPreview key={`post-list-item-${i}`} width={width} {...post} />)
            }
          </List>
        </Box>
      </Section>
    );
  }
  return postsEl;
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
};

const mapStateToProps = (state) => ({
  loading: state.posts.loading,
  posts: selectSortedPosts(state),
  active: state.posts.active,
  width: state.responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...postsActions,
  }, dispatch),
});

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);

export default Posts;
