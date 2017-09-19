import React from 'react';
import PropTypes from 'prop-types';
import Card from 'grommet/components/Card';
import Paragraph from 'grommet/components/Paragraph';
import Timestamp from 'grommet/components/Timestamp';
import Box from 'grommet/components/Box';
import AnnounceIcon from 'grommet/components/icons/base/Announce';
import Anchor from 'grommet/components/Anchor';
import Comments from './Comments';
import VoteBox from '../VoteBox';
import ProfileButton from '../Profile/ProfileButton';

const CommentPreview = ({
  width,
  author,
  body,
  timestamp,
  voteScore,
  id,
  children,
  profileSetUser,
  showChildren,
  applyVote,
  votesGiven,
  username,
}) => (
  <Box direction="column" className="comment-list-item-container">
    <Box
      direction="row"
      responsive={false}
      align="center"
      reverse={width < 500}
      pad={{ horizontal: 'small', vertical: 'none' }}
      className="preview-list-item__inner"
    >
      <VoteBox
        voteScore={voteScore}
        applyVote={(vote) => {
          applyVote(id, vote);
        }}
        vote={votesGiven ? votesGiven[id] : null}
        showScore={author === username}
      />
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
          <Box direction="row" justify="between" align="center" wrap={true}>
            <Anchor path={`/comments/${id}`} className="list-item-link-container">
              <Paragraph className="card-description">{`${body.slice(0, 90)}${body.length > 90 ? '...' : ''}` || null}</Paragraph>
            </Anchor>
            <Timestamp
              value={(new Date(+timestamp)).toISOString()}
              fields="date"
              className="comment-timestamp"
            />
          </Box>
        }
        textSize="small"
      />
    </Box>
    {
      showChildren &&
        <Comments
          width={width}
          comments={children}
          profileSetUser={profileSetUser}
          showChildren={showChildren}
          applyVote={(vote) => {
            applyVote(id, vote);
          }}
          votesGiven={votesGiven}
          username={username}
        />
    }
  </Box>
);

CommentPreview.propTypes = {
  id: PropTypes.string,
  body: PropTypes.string,
  timestamp: PropTypes.number,
  author: PropTypes.string,
  voteScore: PropTypes.number,
  children: PropTypes.array,
  profileSetUser: PropTypes.func,
  applyVote: PropTypes.func,
  votesGiven: PropTypes.object,
  username: PropTypes.string,
};

export default CommentPreview;
