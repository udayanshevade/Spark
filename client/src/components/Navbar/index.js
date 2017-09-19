import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Search from 'grommet/components/Search';
import Title from 'grommet/components/Title';
import MoreIcon from 'grommet/components/icons/base/More';
import FilterSelect from './FilterSelect';
import { searchQueryChange, searchFilterUpdate } from '../../actions/search';
import { getIsMobile } from '../../selectors/responsive';

const NavbarComponent = ({
  isMobile,
  title,
  categoriesQuery,
  postsQuery,
  actions,
  filters,
  activeFilter,
  category,
}) => {
  const filter = filters[activeFilter];
  const value = filter === 'categories' ? categoriesQuery : postsQuery;
  return (
    <Header
      size="medium"
      pad={{ horizontal: 'medium' }}
      className="main-header"
    >
      <Title className="app-header__title" responsive={false}>
        <Anchor path="/"><span>{title}</span></Anchor>
      </Title>
      {
        category &&
          <Box direction="row" responsive={false} pad="none" align="center">
            <MoreIcon size="small" className="header-arrow-icon" />
            <Heading tag="h3" className="post-heading">
              <Anchor path={`/categories/${category}`}>
                /{category}
              </Anchor>
            </Heading>
          </Box>
      }
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
          placeHolder={`Search ${isMobile ? '' : (!category ? filter : `/${category}`)}`}
          onDOMChange={(e) => {
            actions.searchQueryChange(e, category);
          }}
          value={value}
          className="search-input-container"
        />
        {
          !category &&
            <FilterSelect
              filters={filters}
              activeFilter={activeFilter}
              searchFilterUpdate={actions.searchFilterUpdate}
            />
        }
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
  category: PropTypes.string,
  isMobile: PropTypes.bool,
};

const mapStateToProps = ({ responsive, navbar, search, categories, posts }) => ({
  isMobile: getIsMobile(responsive),
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
