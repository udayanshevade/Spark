import React from 'react';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

const VoteHistory = ({
  postsVotesReceivedMax,
  postsVotesReceivedSeries,
  commentsVotesReceivedMax,
  commentsVotesReceivedSeries,
  votesGivenMax,
  votesGivenSeries,
  height,
}) => (
  <Section direction="column" align="center" pad="small">
    <Heading tag="h5" strong>Received</Heading>
    <Box direction="row" justify="between" responsive>
      <VotesMeter
        label="Posts"
        units="votes"
        maxCount={postsVotesReceivedMax}
        votesSeries={postsVotesReceivedSeries}
      />
      <VotesMeter
        label="Comments"
        units="votes"
        maxCount={commentsVotesReceivedMax}
        votesSeries={commentsVotesReceivedSeries}
      />
    </Box>
    {
      height > 768 &&
        <Box direction="column" align="center">
          <Heading tag="h5" strong>Given</Heading>
          <VotesMeter
            units="votes"
            maxCount={votesGivenMax}
            votesSeries={votesGivenSeries}
          />
        </Box>
    }
  </Section>
);

const seriesProps = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })
);

VoteHistory.propTypes = {
  postsVotesReceivedMax: PropTypes.number,
  postsVotesReceivedSeries: seriesProps,
  commentsVotesReceivedMax: PropTypes.number,
  commentsVotesReceivedSeries: seriesProps,
  votesGivenMax: PropTypes.number,
  votesGivenSeries: seriesProps,
  height: PropTypes.number,
};

export default VoteHistory;
