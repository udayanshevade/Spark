import React from 'react';
import { change as changeFieldValue } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import UpdateComment from './UpdateComment';
import { commentCreateNew } from '../../actions/comment';

const NewComment = ({
  actions,
  postId,
  initialValues,
  randomFormID,
  replying,
  setReplyMode,
}) => (
  <UpdateComment
    form={`NewComment_${randomFormID}`}
    onSubmit={actions.commentCreateNew}
    commentUpdateBody={(val) => {
      actions.changeFieldValue(`NewComment_${randomFormID}`, 'body', val);
    }}
    comment={{ ...initialValues, postId }}
    replying={replying}
    setReplyMode={setReplyMode}
  />
);

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    commentCreateNew,
    changeFieldValue,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewComment);
