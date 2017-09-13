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
import { searchSelectSortCriterion } from '../../actions/search';
import { getSortedPosts } from '../../selectors/posts';

export const PostsComponent = ({
  width,
  loading,
  posts,
  actions,
  active,
  ...filterProps,
}) => {
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
      <Section pad={{ vertical: 'none' }}>
        <FilterBar
          width={width}
          {...filterProps}
          selectSortCriterion={actions.searchSelectSortCriterion}
        />
        <Box pad={{ vertical: 'none' }} className="list-items-container">
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

const mapStateToProps = ({ posts, search, responsive }) => ({
  loading: posts.loading,
  posts: getSortedPosts({ posts, search }),
  active: posts.active,
  sortCriteria: search.criteria,
  sortDirection: search.sortDirection,
  selectedCriterion: search.selectedCriterion,
  width: responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...postsActions,
    searchSelectSortCriterion,
  }, dispatch),
});

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);

export default Posts;
