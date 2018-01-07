import React from 'react';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import FlipMove from 'react-flip-move';
import CommentPreview from './CommentPreview';

const Comments = ({
  width,
  comments,
  profileSetUser,
  showChildren,
  applyVote,
  votesGiven,
  username,
  threadView,
  commentDelete,
  commentView,
  postId,
  postGetComments,
  postGetComment,
  depleted,
  loading,
  nested,
  commentId,
  offset,
  limit,
}) => (
  <Box pad={{ vertical: 'none' }} className="comments-container">
    <List className="comment-list">
      <FlipMove
        duration={350}
        easing="ease-in-out"
        typeName={null}
        enterAnimation="accordionVertical"
        leaveAnimation="accordionVertical"
      >
        {
          comments.map((comment, i) => (
            <ListItem
              key={`comment-list-item-${comment.id}`}
              pad={{ horizontal: 'small' }}
              className="comment-list-item"
            >
              <CommentPreview
                width={width}
                profileSetUser={profileSetUser}
                showChildren={showChildren}
                applyVote={applyVote}
                votesGiven={votesGiven}
                username={username}
                threadView={threadView}
                commentDelete={commentDelete}
                commentView={commentView}
                postId={postId}
                postGetComments={postGetComments}
                postGetComment={postGetComment}
                depleted={depleted}
                loading={loading}
                {...comment}
              />
            </ListItem>
          ))
        }
      </FlipMove>
    </List>
    {
      !(depleted || loading) &&
        <Footer justify="start">
          <Button
            className="load-button"
            plain
            label={!commentView ? 'Load more' : null}
            path={commentView ? `/posts/thread/${postId}/` : null}
            onClick={!commentView
              ? () => {
                if (nested) {
                  postGetComment(commentId);
                } else {
                  postGetComments(postId);
                }
              }
              : null
            }
          />
        </Footer>
    }
  </Box>
);

export default Comments;
