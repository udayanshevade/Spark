import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import UpIcon from 'grommet/components/icons/base/Up';
import DownIcon from 'grommet/components/icons/base/Down';
import Value from 'grommet/components/Value';

const VoteBox = ({ voteScore, applyVote, vote }) => (
  <Box
    pad={{ horizontal: 'medium' }}
    justify="center"
    className="vote-box"
  >
    <Button
      icon={
        <UpIcon
          size="small"
          className={vote === 'upVote' ? 'upvote' : ''}
        />
      }
      onClick={() => {
        const newVote = vote === 'upVote' ? null : 'upVote';
        applyVote(newVote);
      }}
    />
    <Value value={voteScore} size="small" />
    <Button
      icon={
        <DownIcon
          size="small"
          className={vote === 'downVote' ? 'downvote' : ''}
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
