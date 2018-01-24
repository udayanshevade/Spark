import React from 'react';
import { connect } from 'react-redux';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Value from 'grommet/components/Value';
import Paragraph from 'grommet/components/Paragraph';
import NotFoundIcon from 'grommet/components/icons/base/Troubleshoot';

const NotFound = ({ title }) => (
  <Box
    justify="center"
    alignSelf="center"
    direction="column"
  >
    <Header
      size="medium"
      pad={{ horizontal: 'medium' }}
    >
      <Title className="app-header__title" responsive={false}>
        <Anchor path="/"><span>{title}</span></Anchor>
      </Title>
    </Header>
    <Value
      value={404}
      icon={<NotFoundIcon />}
      label="Uh oh"
    />
    <Paragraph align="center">
      This is not the page you are looking for.
    </Paragraph>
  </Box>
);

const mapStateToProps = ({ navbar }) => ({
  title: navbar.title,
});

export default connect(mapStateToProps)(NotFound);
