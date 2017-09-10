import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Title from 'grommet/components/Title';
import FilterSelect from './FilterSelect';
import { searchQueryChange, searchFilterUpdate } from '../../actions/search';

const NavbarComponent = ({
  title,
  query,
  actions,
  filters,
  activeFilter,
}) => (
  <Box className="app-header-container">
    <Header
      size="large"
      pad={{ horizontal: 'medium' }}
      className="app-header"
    >
      <Title className="app-header__title" responsive={false}>
        <span>{title}</span>
      </Title>
      <Box
        responsive={false}
        flex
        direction="row"
        justify="end"
      >
        <Search
          responsive={false}
          inline
          fill
          size="medium"
          dropAlign={{ right: 'right' }}
          placeHolder={`Search ${filters[activeFilter]}`}
          onDOMChange={actions.searchQueryChange}
          value={query || ''}
        />
        <FilterSelect
          filters={filters}
          activeFilter={activeFilter}
          searchFilterUpdate={actions.searchFilterUpdate}
        />
      </Box>
    </Header>
  </Box>
);

NavbarComponent.propTypes = {
  title: PropTypes.string,
  query: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.string,
  ),
  activeFilter: PropTypes.number,
  actions: PropTypes.shape({
    searchQueryChange: PropTypes.func,
    searchFilterChange: PropTypes.func,
  }),
};

const mapStateToProps = ({ navbar, search }) => ({
  title: navbar.title,
  query: search.query,
  filters: search.filters,
  activeFilter: search.activeFilter,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    searchQueryChange,
    searchFilterUpdate,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);
