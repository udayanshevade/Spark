import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Categories from '../Categories';
import Posts from '../Posts';

const components = {
  'categories': <Categories />,
  'posts': <Posts />,
};

export const Main = ({ filters, activeFilter }) => (
  <Box pad={{ vertical: 'medium' }} className="main-container">
    {components[filters[activeFilter]]}
  </Box>
);

Main.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
  activeFilter: PropTypes.number,
};

const mapStateToProps = ({ search }) => ({
  filters: search.filters,
  activeFilter: search.activeFilter,
});

const MainContainer = connect(mapStateToProps)(Main);

export default MainContainer;
