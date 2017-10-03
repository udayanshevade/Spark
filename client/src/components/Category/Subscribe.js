import React from 'react';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';

const Subscribe = ({
  category,
  subscribers,
  toggleSubscribe,
  loggedIn,
  userSubscribed,
}) => (
  <Box direction="row" justify="center" responsive={false} className="subscribe-container">
    {
      loggedIn &&
        <Button
          plain
          className="subscribe-button"
          label={`${userSubscribed ? 'Uns' : 'S'}ubscribe`}
          onClick={() => {
            toggleSubscribe(category);
          }}
        />
    }
    <span className="subscribers-label">
      {subscribers || 0} {`subscriber${!subscribers || subscribers > 1 ? 's' : ''}`}
    </span>
  </Box>
);

export default Subscribe;
