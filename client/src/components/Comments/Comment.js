import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Paragraph from 'grommet/components/Paragraph';
import Timestamp from 'grommet/components/Timestamp';
import Button from 'grommet/components/Button';
import AnnounceIcon from 'grommet/components/icons/base/Announce';
import VoteBox from '../VoteBox';
import ProfileButton from '../Profile/ProfileButton';

const Comment = ({
  width,
  voteScore,
  id,
  votesGiven,
  author,
  username,
  profileSetUser,
  body,
  deleted,
  timestamp,
  setEditMode,
  setReplyMode,
  threadView,
  applyVote,
  commentDelete,
}) => (
  <Box
    direction="row"
    responsive={false}
    align="center"
    reverse={width < 500}
    pad={{ horizontal: 'small', vertical: 'none' }}
    className="preview-list-item__inner"
  >
    {
      !deleted &&
        <VoteBox
          voteScore={voteScore}
          applyVote={(vote) => {
            applyVote(id, vote);
          }}
          vote={votesGiven ? votesGiven[id] : null}
          showScore={author === username}
        />
    }
    <Card
      flex
      label={
        <div>
          <ProfileButton
            author={author}
            icon={<AnnounceIcon size="xsmall" className="user-button-icon" />}
            profileSetUser={profileSetUser}
          />
          <span>said:</span>
        </div>
      }
      description={
        <Box
          direction="column"
          justify="between"
          align="start"
        >
          <Paragraph
            className={`card-description ${deleted ? 'card-description--deleted' : ''}`}
          >
            {deleted ? 'deleted' : body || null}
          </Paragraph>
          <Timestamp
            value={(new Date(+timestamp)).toISOString()}
            fields="date"
            className="comment-timestamp"
          />
          <Box
            direction="row"
            className="options-tray"
            pad={{ vertical: 'small' }}
            responsive={false}
          >
            {
              author === username &&
                <Button
                  plain
                  label={deleted ? 'restore' : 'delete'}
                  className="options-tray__button"
                  onClick={() => {
                    commentDelete(id);
                  }}
                />
            }
            <Button
              plain
              label="link"
              path={`/comments/${id}`}
              className="options-tray__button"
            />
            {
              !deleted && author === username &&
                <Button
                  plain
                  label="edit"
                  className="options-tray__button"
                  onClick={() => { setEditMode(true); }}
                />
            }
            {
              threadView && username &&
                <Button
                  plain
                  label="reply"
                  className="options-tray__button"
                  onClick={() => { setReplyMode(true); }}
                />
            }
          </Box>
        </Box>
      }
      textSize="small"
    />
  </Box>
);

Comment.propTypes = {
  width: PropTypes.number,
  voteScore: PropTypes.number,
  id: PropTypes.string,
  votesGiven: PropTypes.object,
  author: PropTypes.string,
  username: PropTypes.string,
  profileSetUser: PropTypes.func,
  body: PropTypes.string,
  timestamp: PropTypes.number,
  setEditMode: PropTypes.func,
  threadView: PropTypes.bool,
  applyVote: PropTypes.func,
  commentDelete: PropTypes.func,
};

export default Comment;
