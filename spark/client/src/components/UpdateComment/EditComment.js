import React from 'react';
import { change as changeFieldValue } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UpdateComment from './UpdateComment';
import { commentUpdate } from '../../actions/comment';

const EditComment = ({
  initialValues,
  editing,
  setEditMode,
  actions,
}) => (
  <UpdateComment
    form={`EditForm_${initialValues.id}`}
    onSubmit={actions.commentUpdate}
    commentUpdateBody={(val) => {
      actions.changeFieldValue(`EditForm_${initialValues.id}`, 'body', val);
    }}
    comment={initialValues}
    editing={editing}
    setEditMode={setEditMode}
  />
);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    commentUpdate,
    changeFieldValue,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditComment);
