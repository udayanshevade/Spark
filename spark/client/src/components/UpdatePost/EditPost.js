import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change as changeFieldValue, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import UpdatePost from './UpdatePost';
import {
  postSetCreating,
  postSetSubmitStatus,
  postEdit,
  postGetCategorySuggestions,
  postUpdateCreateData,
  postResetCreateData,
} from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';

const EditPost = ({
  postData,
  submitStatus,
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
  formVals,
}) => (
  <UpdatePost
    form="postCreateNew"
    actions={actions}
    onSubmit={(form) => {
      postEdit(match.params.id, form);
    }}
    postData={postData}
    submitStatus={submitStatus}
    isUpdating={isCreating}
    formVals={formVals}
    isMobile={isMobile}
    navTitle={navTitle}
    suggestions={suggestions}
    updateType="edit"
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

const selector = formValueSelector('postCreateNew');

const mapStateToProps = ({ post, navbar, responsive, ...state }) => ({
  postData: post.data,
  submitStatus: post.submitStatus,
  initialValues: post.createData,
  categorySuggestions: post.categorySuggestions,
  isCreating: post.creating,
  navTitle: navbar.title,
  isMobile: getIsMobile(responsive),
  formVals: {
    title: selector(state, 'title'),
    url: selector(state, 'url'),
    body: selector(state, 'body'),
    category: selector(state, 'category'),
  },
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postSetUpdating: postSetCreating,
    postSetSubmitStatus,
    postEdit,
    postGetCategorySuggestions,
    postUpdateCreateData,
    postUpdateCategoryValue: changeFieldValue,
    postResetCreateData,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPost);
