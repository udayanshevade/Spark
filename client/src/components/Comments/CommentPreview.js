import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Comments from './Comments';
import Comment from './Comment';
import EditComment from '../UpdateComment/EditComment';
import NewComment from '../UpdateComment/NewComment';
import { getRandomID } from '../../utils';

class CommentPreview extends Component {
  state = {
    offset: 0,
    limit: 10,
    editing: false,
    replying: false,
    tempReplyId: getRandomID(),
  }
  setEditMode = (editing) => {
    this.setState({
      editing,
    });
  }
  setReplyMode = (replying) => {
    this.setState({
      replying,
    });
  }
  setCommentChildrenOffset = async(commentId) => {
    const res = await this.props.postGetComment(
      commentId,
      'children',
      this.state.offset,
      this.state.limit
    );
    if (!res) return;
    const { offset } = res;
    this.setState({
      offset,
    });
  }
  render() {
    const {
      width,
      profileSetUser,
      showChildren,
      applyVote,
      votesGiven,
      username,
      threadView,
      commentView,
      commentDelete,
      postGetComment,
      postGetComments,
      ...comment,
    } = this.props;
    const {
      author,
      body,
      created,
      votes,
      id,
      children,
      postId,
      deleted,
      depleted,
    } = comment;
    const commentEl = this.state.editing
      ? (
        <EditComment
          initialValues={{ id, body, postId }}
          editing={this.state.editing}
          setEditMode={this.setEditMode}
        />
      ) : (
        <Comment
          width={width}
          votes={votes}
          id={id}
          postId={postId}
          votesGiven={votesGiven}
          author={author}
          username={username}
          profileSetUser={profileSetUser}
          body={body}
          deleted={deleted}
          created={created}
          setEditMode={this.setEditMode}
          setReplyMode={this.setReplyMode}
          threadView={threadView}
          commentView={commentView}
          applyVote={applyVote}
          commentDelete={commentDelete}
        />
      );
    return (
      <Box direction="column" className="comment-list-item-container">
        {commentEl}
        {
          this.state.replying &&
            <NewComment
              randomFormID={this.state.tempReplyId}
              postId={postId}
              replying={this.state.replying}
              setReplyMode={this.setReplyMode}
              initialValues={{
                parentId: id,
                body: '',
              }}
            />
        }
        {
          showChildren &&
            <Comments
              width={width}
              comments={children}
              profileSetUser={profileSetUser}
              showChildren={showChildren}
              applyVote={applyVote}
              votesGiven={votesGiven}
              username={username}
              threadView={threadView}
              commentDelete={commentDelete}
              postGetComment={this.setCommentChildrenOffset}
              postGetComments={postGetComments}
              depleted={depleted}
              postId={postId}
              nested
              commentId={id}
              offset={this.state.offset}
              limit={this.state.limit}
            />
        }
      </Box>
    );
  }
}

CommentPreview.propTypes = {
  id: PropTypes.string,
  body: PropTypes.string,
  created: PropTypes.string,
  author: PropTypes.string,
  votes: PropTypes.shape({
    upVote: PropTypes.number,
  }),
  children: PropTypes.array,
  profileSetUser: PropTypes.func,
  applyVote: PropTypes.func,
  votesGiven: PropTypes.object,
  username: PropTypes.string,
  commentDelete: PropTypes.func,
  postGetComment: PropTypes.func,
};

export default CommentPreview;
