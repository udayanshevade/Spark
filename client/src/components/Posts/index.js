import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from 'grommet/components/List';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Spinning from 'grommet/components/icons/Spinning';
import PostPreview from './PostPreview';
import * as postsActions from '../../actions/posts';

export const PostsComponent = ({ loading, posts, actions, active }) => {
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
      <List>
        {
          posts.map((post, i) => <PostPreview key={`post-list-item-${i}`} {...post} />)
        }
      </List>
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
};

const mapStateToProps = ({ posts }) => ({
  loading: posts.loading,
  posts: posts.posts,
  active: posts.active,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...postsActions,
  }, dispatch),
});

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);

export default Posts;
