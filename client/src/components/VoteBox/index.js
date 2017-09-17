import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import UpIcon from 'grommet/components/icons/base/Up';
import DownIcon from 'grommet/components/icons/base/Down';
import Value from 'grommet/components/Value';

const VoteBox = ({ voteScore, applyVote, vote, showScore }) => (
  <Box
    pad={{ horizontal: 'small' }}
    justify="center"
    className="vote-box"
  >
    <Button
      icon={
        <UpIcon
          size="xsmall"
          className={`upvote ${vote === 'upVote' ? 'upvote--active' : ''}`}
        />
      }
      onClick={() => {
        const newVote = vote === 'upVote' ? null : 'upVote';
        applyVote(newVote);
      }}
    />
    {showScore && <Value value={voteScore} size="xsmall" />}
    <Button
      icon={
        <DownIcon
          size="xsmall"
          className={`downvote ${vote === 'downVote' ? 'downvote--active' : ''}`}
        />}
      onClick={() => {
        const newVote = vote === 'downVote' ? null : 'downVote';
        applyVote(newVote);
      }}
    />
  </Box>
);

VoteBox.propTypes = {
  voteScore: PropTypes.number,
};

export default VoteBox;
