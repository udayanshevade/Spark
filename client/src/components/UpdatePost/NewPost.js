import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change as changeFieldValue, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import UpdatePost from './UpdatePost';
import {
  postSetCreating,
  postSetSubmitStatus,
  postCreateNew,
  postGetCategorySuggestions,
  postUpdateCreateData,
  postResetCreateData,
} from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';

const NewPost = ({
  postData,
  submitStatus,
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
  formVals,
}) => (
  <UpdatePost
    form="postCreateNew"
    actions={actions}
    onSubmit={postCreateNew}
    submitStatus={submitStatus}
    postData={postData}
    isUpdating={isCreating}
    formVals={formVals}
    isMobile={isMobile}
    navTitle={navTitle}
    suggestions={suggestions}
    updateType="new"
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

const selector = formValueSelector('postCreateNew');

const mapStateToProps = ({ post, navbar, responsive, ...state }) => ({
  submitStatus: post.submitStatus,
  postData: post.data,
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
    postCreateNew,
    postGetCategorySuggestions,
    postUpdateCreateData,
    postUpdateCategoryValue: changeFieldValue,
    postResetCreateData,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
