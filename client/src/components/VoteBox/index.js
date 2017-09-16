import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import CaretUp from 'grommet/components/icons/base/CaretUp';
import CaretDown from 'grommet/components/icons/base/CaretDown';
import Value from 'grommet/components/Value';

const VoteBox = ({ voteScore }) => (
  <Box
    pad={{ horizontal: 'medium' }}
    justify="center"
    className="vote-box"
  >
    <Button
      icon={<CaretUp size="xsmall" />}
      onClick={() => console.log('Up Vote!')}
    />
    <Value value={voteScore} size="small" />
    <Button
      icon={<CaretDown size="xsmall" />}
      onClick={() => console.log('Down Vote!')}
    />
  </Box>
);

VoteBox.propTypes = {
  voteScore: PropTypes.number,
};

export default VoteBox;
