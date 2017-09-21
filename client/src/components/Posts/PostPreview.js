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
  url,
  author,
  body,
  timestamp,
  voteScore,
  id,
  comments,
  category,
  main,
  threadView,
  showFull,
  toggleShowFull,
  profileSetUser,
  bodyCharLim,
  applyVote,
  votesGiven,
  username,
  deleted,
  postDelete,
  postUpdateCreateData,
}) => (
  <Box
    direction="row"
    responsive={false}
    align="center"
    reverse={width < 500}
    pad={{ horizontal: 'small' }}
    className={`preview-item__inner ${main ? 'post-header' : ''}`}
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
            icon={<NewIcon size="xsmall" className="user-button-icon" />}
            profileSetUser={profileSetUser}
          />
          <span>shared</span>
          {
            !threadView &&
              <span className="anchor-text-padded">in <Anchor path={`/categories/${category}`}>/{category}</Anchor></span>
          }
          :
        </div>
      }
      heading={
        <Anchor
          href={url}
          path={!url ? `/posts/thread/${id}/${title.toLowerCase().split(' ').join('-')}` : null}
          className={`list-item-link-container${url ? ' list-item--link-out' : ''}`}
        >
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
            value={(new Date(+timestamp)).toISOString()}
            fields="date"
            className="post-timestamp"
          />
          {
            body &&
              <Paragraph className="post-description">
                {`${body.slice(0, (showFull ? body.length : bodyCharLim))}${body.length > bodyCharLim ? '...' : ''}` || null}
              </Paragraph>
          }
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
          <Box
            direction="row"
            className="options-tray"
            pad={{ vertical: 'small' }}
            responsive={false}
          >
            {
              !threadView &&
                <Button
                  plain
                  path={`/posts/thread/${id}/${title.toLowerCase().split(' ').join('-')}`}
                  className="options-tray__button"
                  label={`${comments.length} comments`}
                />
            }
            {
              username === author &&
                <Button
                  plain
                  className="options-tray__button"
                  label={deleted ? 'deleted' : 'delete'}
                  onClick={
                    deleted
                      ? null
                      : () => {
                          postDelete(id);
                        }
                  }
                />
            }
            {
              username === author &&
                <Button
                  plain
                  className="options-tray__button"
                  label="edit"
                  path={`/posts/edit/${id}`}
                  onClick={postUpdateCreateData
                    ? () => {
                      postUpdateCreateData({
                        title,
                        url,
                        body,
                        category,
                      });
                    }
                    : null
                  }
                />
            }
          </Box>
        </Box>
      }
      textSize="small"
      pad={{ horizontal: 'none', vertical: 'small' }}
    />
  </Box>
);

PostPreview.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  id: PropTypes.string,
  body: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.string),
  timestamp: PropTypes.number,
  author: PropTypes.string,
  voteScore: PropTypes.number,
  showFull: PropTypes.bool,
  profileSetUser: PropTypes.func,
  votesGiven: PropTypes.object,
  username: PropTypes.string,
  postDelete: PropTypes.func,
};

export default PostPreview;
