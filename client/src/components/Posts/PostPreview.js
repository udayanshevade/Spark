import React from 'react';
import PropTypes from 'prop-types';
import ListItem from 'grommet/components/ListItem';
import Card from 'grommet/components/Card';
import Anchor from 'grommet/components/Anchor';
import NewIcon from 'grommet/components/icons/base/New';

const PostPreview = ({ title, author, body, id }) => (
  <ListItem separator="horizontal" pad={{ horizontal: 'medium' }}>
    <Card
      label={
        <div>
          <Anchor icon={<NewIcon size="xsmall" />}>{author}</Anchor>
          <span className="anchor-text-padded">shared:</span>
        </div>
      }
      heading={title}
      description={body || null}
    />
  </ListItem>
);

PostPreview.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  body: PropTypes.string,
  author: PropTypes.string,
};

export default PostPreview;
