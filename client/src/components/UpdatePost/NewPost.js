import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change as changeFieldValue } from 'redux-form';
import PropTypes from 'prop-types';
import UpdatePost from './UpdatePost';
import {
  postCreateNew,
  postGetCategorySuggestions,
  postUpdateCreateData,
} from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';

const NewPost = ({
  postData,
  initialValues,
  actions: {
    postCreateNew,
    postUpdateCategoryValue,
    ...actions,
  },
  isCreating,
  isMobile,
  navTitle,
  categorySuggestions: {
    results: suggestions,
  },
}) => (
  <UpdatePost
    actions={actions}
    onSubmit={postCreateNew}
    postData={postData}
    isUpdating={isCreating}
    isMobile={isMobile}
    navTitle={navTitle}
    suggestions={suggestions}
    heading="new post"
    initialValues={initialValues}
    updateSelectInput={(val) => {
      postUpdateCategoryValue('postCreateNew', 'category', val);
    }}
  />
);

NewPost.propTypes = {
  navTitle: PropTypes.string,
  actions: PropTypes.shape({
    postCreateNew: PropTypes.func,
  }),
  isMobile: PropTypes.bool,
  categorySuggestions: PropTypes.shape({
    results: PropTypes.arrayOf(
      PropTypes.string
    ),
  }),
};

const mapStateToProps = ({ post, navbar, responsive }) => ({
  postData: post.data,
  initialValues: post.createData,
  categorySuggestions: post.categorySuggestions,
  isCreating: post.creating,
  navTitle: navbar.title,
  isMobile: getIsMobile(responsive),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postCreateNew,
    postGetCategorySuggestions,
    postUpdateCreateData,
    postUpdateCategoryValue: changeFieldValue,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
