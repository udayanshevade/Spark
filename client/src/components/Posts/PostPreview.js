import React from 'react';
import PropTypes from 'prop-types';
import Card from 'grommet/components/Card';
import Paragraph from 'grommet/components/Paragraph';
import Timestamp from 'grommet/components/Timestamp';
import Box from 'grommet/components/Box';
import DownIcon from 'grommet/components/icons/base/CaretDown';
import NewIcon from 'grommet/components/icons/base/New';
import Button from 'grommet/components/Button';
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
  category,
  main,
  threadView,
  showFull,
  toggleShowFull,
  profileSetUser,
  bodyCharLim,
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
          <span>shared</span>
          {
            !threadView &&
              <span className="anchor-text-padded">in <Anchor path={`/categories/${category}`}>/{category}</Anchor>:</span>
          }
        </div>
      }
      heading={
        <Anchor path={`/posts/${id}/${title.toLowerCase().split(' ').join('-')}`} className="list-item-link-container">
          <Heading tag="h4" className="post-preview-title">{title}</Heading>
        </Anchor>
      }
      description={
        <Box
          direction="column"
          responsive
          justify="center"
          align="start"
        >
          <Timestamp
            value={(new Date(timestamp)).toISOString()}
            fields="date"
            className="post-timestamp"
          />
          <Paragraph>
            {`${body.slice(0, (showFull ? body.length : bodyCharLim))}${body.length > bodyCharLim ? '...' : ''}` || null}
          </Paragraph>
          {
            threadView && body.length > bodyCharLim &&
              <Button
                plain
                icon={
                  <DownIcon
                    size="xsmall"
                    onClick={toggleShowFull}
                  />
                }
              />
          }
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
  showFull: PropTypes.bool,
  profileSetUser: PropTypes.func,
};

export default PostPreview;
