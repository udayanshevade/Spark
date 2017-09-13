import React from 'react';
import PropTypes from 'prop-types';
import ListItem from 'grommet/components/ListItem';
import Card from 'grommet/components/Card';
import Paragraph from 'grommet/components/Paragraph';
import Timestamp from 'grommet/components/Timestamp';
import Box from 'grommet/components/Box';
import NewIcon from 'grommet/components/icons/base/New';
import Button from 'grommet/components/Button';
import VoteBox from '../VoteBox';

const PostPreview = ({
  width,
  title,
  author,
  body,
  timestamp,
  voteScore,
  id,
  profileSetUser,
}) => (
  <ListItem
    pad={{ horizontal: 'medium' }}
    direction="row"
    responsive={false}
    align="center"
    reverse={width < 500}
  >
    <VoteBox voteScore={voteScore} />
    <Card
      flex
      label={
        <div>
          <Button
            plain
            label={author}
            icon={<NewIcon size="xsmall" className="user-button-icon" />}
            onClick={() => {
              profileSetUser(author);
            }}
          />
          <span className="anchor-text-padded">shared:</span>
        </div>
      }
      heading={title}
      description={
        <Box direction="row" justify="between" align="center" wrap={true}>
          <Paragraph>{body || null}</Paragraph>
          <Timestamp
            value={(new Date(timestamp)).toISOString()}
            fields="date"
            className="post-timestamp"
          />
        </Box>
      }
      textSize="small"
    />
  </ListItem>
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
