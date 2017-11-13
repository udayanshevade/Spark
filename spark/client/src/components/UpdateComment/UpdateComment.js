import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Form from 'grommet/components/Form';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import FormTextArea from '../Forms/FormTextArea';
import { validate, warn } from './validation';

class UpdateComment extends Component {
  state = {
    comment: { ...this.props.comment },
  }
  commentReset = () => {
    this.commentUpdateBody('');
  }
  commentUpdateBody = (body) => {
    this.props.commentUpdateBody(body);
    this.setState({
      comment: {
        ...this.state.comment,
        body,
      },
    });
  }
  commentSubmit = async(formData) => {
    const { editing, setEditMode, setReplyMode, comment, onSubmit } = this.props;
    const newCommentSuccess = await onSubmit({
      ...comment,
      ...formData,
    });
    if (newCommentSuccess) {
      if (editing) {
        setEditMode(false);
      } else {
        this.commentReset();
        if (setReplyMode) {
          setReplyMode(false);
        }
      }
    }
  }
  render() {
    const {
      handleSubmit,
      editing,
      replying,
      setEditMode,
      setReplyMode,
    } = this.props;
    const updating = editing || replying;
    return (
      <Form
        onSubmit={handleSubmit(this.commentSubmit)}
        className="new-comment"
        pad={{ horizontal: 'small', vertical: 'medium' }}
      >
        <Field
          name="body"
          id="update-comment"
          placeholder="Share your thoughts"
          onValueUpdate={this.commentUpdateBody}
          val={this.state.comment.body}
          component={FormTextArea}
        />
        <Footer
          pad={{ vertical: 'small' }}
          justify="end"
          className="new-comment-footer"
        >
          {
            updating &&
              <Button
                plain
                label={editing ? 'cancel' : 'discard'}
                onClick={() => {
                  if (editing) {
                    setEditMode(false);
                  } else if (replying) {
                    setReplyMode(false);
                  }
                }}
              />
          }
          <Button
            plain
            label={editing ? 'edit' : 'comment'}
            onClick={handleSubmit(this.commentSubmit)}
          />
        </Footer>
      </Form>
    );
  }
}

UpdateComment.propTypes = {
  onSubmit: PropTypes.func,
};

export default reduxForm({
  validate,
  warn,
})(UpdateComment);
