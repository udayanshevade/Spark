import React from 'react';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import DownIcon from 'grommet/components/icons/base/CaretDown';

const Blurb = ({
  blurb,
  blurbExpanded,
  blurbLimit,
  iconHide,
  toggleBlurbExpanded,
}) => (
  blurb
    ? (
      <Box direction="column" align="center" className="blurb-container">
        <Paragraph
          margin="small"
          className="blurb-paragraph"
        >
          {`${blurb.slice(0, blurbExpanded
              ? blurb.length
              : blurbLimit
            )}${blurbExpanded ||
              blurb.length < blurbLimit
                ? ''
                : '...'
            }`}
        </Paragraph>
        {
          !iconHide &&
            blurb.length > blurbLimit && 
              <DownIcon
                onClick={() => {
                  toggleBlurbExpanded(!blurbExpanded);
                }}
                size="xsmall"
                className={`expand-icon ${blurbExpanded ? 'expand-icon--flipped' : ''}`}
              />
        }
      </Box>
    )
    : null
);

Blurb.propTypes = {
  blurb: PropTypes.string,
  blurbExpanded: PropTypes.bool,
  blurbLimit: PropTypes.number,
  toggleBlurbExpanded: PropTypes.func,
};

export default Blurb;
