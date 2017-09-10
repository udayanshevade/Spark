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
  categoriesQuery,
  postsQuery,
  actions,
  filters,
  activeFilter,
}) => {
  const filter = filters[activeFilter];
  const value = filter === 'categories' ? categoriesQuery : postsQuery;
  return (
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
          placeHolder={`Search ${filter}`}
          onDOMChange={actions.searchQueryChange}
          value={value}
        />
        <FilterSelect
          filters={filters}
          activeFilter={activeFilter}
          searchFilterUpdate={actions.searchFilterUpdate}
        />
      </Box>
    </Header>
  );
}

NavbarComponent.propTypes = {
  title: PropTypes.string,
  categoriesQuery: PropTypes.string,
  postsQuery: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.string,
  ),
  activeFilter: PropTypes.number,
  actions: PropTypes.shape({
    searchQueryChange: PropTypes.func,
    searchFilterChange: PropTypes.func,
  }),
};

const mapStateToProps = ({ navbar, search, categories, posts }) => ({
  title: navbar.title,
  categoriesQuery: categories.query,
  postsQuery: posts.query,
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
