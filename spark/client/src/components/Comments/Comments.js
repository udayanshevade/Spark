import React from 'react';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
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
}) => (
  <Box pad={{ vertical: 'none' }} className="comments-container">
    <List className="comment-list">
      {
        comments.map((comment, i) => (
          <ListItem
            key={`comment-list-item-${i}`}
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
              {...comment}
            />
          </ListItem>
        ))
      }
    </List>
  </Box>
);

export default Comments;
