import React from 'react';
import PropTypes from 'prop-types';
import Card from 'grommet/components/Card';
import Paragraph from 'grommet/components/Paragraph';
import Timestamp from 'grommet/components/Timestamp';
import Box from 'grommet/components/Box';
import NewIcon from 'grommet/components/icons/base/New';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import VoteBox from '../VoteBox';
import ProfileButton from '../Profile/ProfileButton';

const PostPreview = ({
  width,
  title,
  author,
  body,
  timestamp,
  voteScore,
  id,
  main,
  profileSetUser,
}) => (
  <Box
    direction="row"
    responsive={false}
    align="center"
    reverse={width < 500}
    pad={{ horizontal: 'small' }}
    className={`preview-item__inner ${main ? 'post-header' : ''}`}
  >
    <VoteBox voteScore={voteScore} />
    <Card
      flex
      label={
        <div>
          <ProfileButton
            author={author}
            icon={<NewIcon size="xsmall" className="user-button-icon" />}
            profileSetUser={profileSetUser}
          />
          <span className="anchor-text-padded">shared:</span>
        </div>
      }
      heading={
        <Anchor path={`/posts/${id}`} className="list-item-link-container">
          <Heading tag="h4" className="post-preview-title">{title}</Heading>
        </Anchor>
      }
      description={
        <Box direction="row" justify="between" align="center" wrap={true}>
          <Paragraph>{`${body.slice(0, 90)}${body.length > 90 ? '...' : ''}` || null}</Paragraph>
          <Timestamp
            value={(new Date(timestamp)).toISOString()}
            fields="date"
            className="post-timestamp"
          />
        </Box>
      }
      textSize="small"
    />
  </Box>
);

PostPreview.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  body: PropTypes.string,
  timestamp: PropTypes.number,
  author: PropTypes.string,
  voteScore: PropTypes.number,
  profileSetUser: PropTypes.func,
};

export default PostPreview;
