import React from 'react';
import PropTypes from 'prop-types';
import VotesMeter from '../VotesMeter';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

const VoteHistory = ({
  postVotesReceivedMax,
  postVotesReceivedSeries,
  commentVotesReceivedMax,
  commentVotesReceivedSeries,
  votesGivenMax,
  votesGivenSeries,
  height,
}) => (
  <Section direction="column" align="center" pad="small">
    <Heading tag="h4">Votes:</Heading>
    <Heading tag="h5" strong>Received</Heading>
    <Box direction="row" justify="between" responsive>
      <VotesMeter
        label="Posts"
        units="votes"
        maxCount={postVotesReceivedMax}
        votesSeries={postVotesReceivedSeries}
      />
      <VotesMeter
        label="Comments"
        units="votes"
        maxCount={commentVotesReceivedMax}
        votesSeries={commentVotesReceivedSeries}
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
  postVotesReceivedMax: PropTypes.number,
  postVotesReceivedSeries: seriesProps,
  commentVotesReceivedMax: PropTypes.number,
  commentVotesReceivedSeries: seriesProps,
  votesGivenMax: PropTypes.number,
  votesGivenSeries: seriesProps,
  height: PropTypes.number,
};

export default VoteHistory;
