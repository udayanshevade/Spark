import React from 'react';
import PropTypes from 'prop-types';
import Card from 'grommet/components/Card';
import Timestamp from 'grommet/components/Timestamp';
import Box from 'grommet/components/Box';
import NewIcon from 'grommet/components/icons/base/New';
import Button from 'grommet/components/Button';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import VoteBox from '../VoteBox';
import ProfileButton from '../Profile/ProfileButton';
import Blurb from '../Blurb';

const PostPreview = ({
  width,
  title,
  url,
  author,
  body,
  created,
  votes,
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
  profileSetPreviewActive,
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
      votes={votes}
      applyVote={(vote) => {
        applyVote(id, vote);
      }}
      vote={votesGiven ? votesGiven[id] : null}
      showScore
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
              <span className="anchor-text-padded">in <Anchor path={`/categories/category/${category}`}>/{category}</Anchor></span>
          }
          :
        </div>
      }
      heading={
        <Anchor
          href={
            url.startsWith('http://') || url.startsWith('https://')
              ? url
              : `http://${url}`
          }
          onClick={() => {
            if (profileSetPreviewActive) {
              profileSetPreviewActive(false);
            }
          }}
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
          <Blurb
            blurb={body}
            blurbExpanded={showFull}
            blurbLimit={bodyCharLim}
            toggleBlurbExpanded={toggleShowFull}
            iconHide={!threadView}
          />
          <Timestamp
            value={(new Date(created)).toISOString()}
            fields="date"
            className="post-timestamp"
          />
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
                  onClick={() => {
                    if (profileSetPreviewActive) {
                      profileSetPreviewActive(false);
                    }
                  }}
                  className="options-tray__button"
                  label={`${comments} comment${comments === 1 ? '' : 's'}`}
                />
            }
            {
              username === author &&
                <Button
                  plain
                  className="options-tray__button"
                  label={deleted ? 'restore' : 'delete'}
                  onClick={() => {
                    const shouldDelete = deleted ? 'restore' : 'delete';
                    postDelete(id, author, shouldDelete);
                  }}
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
                      if (profileSetPreviewActive) {
                        profileSetPreviewActive(false);
                      }
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
  comments: PropTypes.number,
  created: PropTypes.string,
  author: PropTypes.string,
  votes: PropTypes.shape({
    upVote: PropTypes.number,
  }),
  showFull: PropTypes.bool,
  profileSetUser: PropTypes.func,
  votesGiven: PropTypes.object,
  username: PropTypes.string,
  postDelete: PropTypes.func,
};

export default PostPreview;
