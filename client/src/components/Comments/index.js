import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Spinning from 'grommet/components/icons/Spinning';
import Comments from './Comments';
import FilterBar from '../FilterBar';
import { postSelectSortCriterion } from '../../actions/post';
import { profileSetUser } from '../../actions/profile';
import { getSortedComments } from '../../selectors/post';

export const CommentsContainer = ({
  width,
  loading,
  comments,
  actions,
  ...filterProps,
}) => {
  let commentsEl;
  if (loading) {
    commentsEl = (
      <Box
        align="center"
        pad="large"
        className="loading-container"
      >
        <Spinning className="loading-spinner" />
      </Box>
    );
  } else if (!comments.length) {
    commentsEl = (
      <ListPlaceHolder
        emptyMessage="No comments yet."
        filteredTotal={comments.length}
        unfilteredTotal={comments.length}
      />
    );
  } else {
    commentsEl = (
      <Section pad={{ vertical: 'large' }}>
        <FilterBar
          width={width}
          {...filterProps}
          selectSortCriterion={actions.postSelectSortCriterion}
        />
        <Comments
          width={width}
          comments={comments}
          profileSetUser={actions.profileSetUser}
          showChildren
        />
      </Section>
    );
  }
  return commentsEl;
}

CommentsContainer.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ),
  actions: PropTypes.shape({
    profileSetUser: PropTypes.func,
  }),
  width: PropTypes.number,
};

const mapStateToProps = ({ post, responsive }) => ({
  loading: post.loading,
  comments: getSortedComments(post),
  sortCriteria: post.criteria,
  sortDirection: post.sortDirection,
  selectedCriterion: post.selectedCriterion,
  width: responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postSelectSortCriterion,
    profileSetUser,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
