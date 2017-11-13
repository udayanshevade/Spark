import React from 'react';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

const Loading = () => (
  <Box
    pad="large"
    align="center"
    className="loading-container"
  >
    <Spinning className="loading-spinner" />
  </Box>
);

export default Loading;
