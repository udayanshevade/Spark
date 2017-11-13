import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change as changeFieldValue } from 'redux-form';
import PropTypes from 'prop-types';
import UpdatePost from './UpdatePost';
import {
  postEdit,
  postGetCategorySuggestions,
  postUpdateCreateData,
  postResetCreateData,
} from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';

const EditPost = ({
  postData,
  initialValues,
  actions: {
    postEdit,
    postUpdateCategoryValue,
    ...actions,
  },
  isCreating,
  isMobile,
  navTitle,
  categorySuggestions: {
    results: suggestions,
  },
  match,
}) => (
  <UpdatePost
    form="postCreateNew"
    actions={actions}
    onSubmit={(form) => {
      postEdit(match.params.id, form);
    }}
    postData={postData}
    isUpdating={isCreating}
    isMobile={isMobile}
    navTitle={navTitle}
    suggestions={suggestions}
    heading="edit post"
    initialValues={initialValues}
    updateSelectInput={(val) => {
      postUpdateCategoryValue('postCreateNew', 'category', val);
    }}
  />
);

EditPost.propTypes = {
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
    postEdit,
    postGetCategorySuggestions,
    postUpdateCreateData,
    postUpdateCategoryValue: changeFieldValue,
    postResetCreateData,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
