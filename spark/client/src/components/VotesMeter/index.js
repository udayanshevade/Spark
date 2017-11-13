import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';

const VotesMeter = ({ label, maxCount, votesSeries }) => (
  <Box pad={{ vertical: 'small' }} align="center">
    {label && <Heading tag="h6">{label}</Heading>}
    <AnnotatedMeter
      type="circle"
      max={maxCount}
      series={votesSeries}
      size="small"
    />
  </Box>
);

VotesMeter.propTypes = {
  label: PropTypes.string,
  maxCount: PropTypes.number,
  votesSeries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};

export default VotesMeter;
