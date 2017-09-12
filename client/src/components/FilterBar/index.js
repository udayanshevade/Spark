import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from 'grommet/components/Header';
import Sort from 'grommet-addons/components/Sort';
import { searchSelectSortCriterion } from '../../actions/search';

const FilterBarComponent = ({
  sortCriteria,
  sortDirection,
  selectedCriterion,
  actions,
  width,
}) => {
  return (
    <Header
      responsive={false}
      flex
      size="small"
      justify={width < 500 ? 'end' : 'center'}
      pad="small"
      className="filter-header"
    >
      <Sort
        options={sortCriteria}
        direction={sortDirection}
        value={selectedCriterion}
        onChange={actions.searchSelectSortCriterion}
      />
    </Header>
  );
}

FilterBarComponent.propTypes = {
  sortCriteria: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
    }),
  ),
  sortDirection: PropTypes.string,
  selectedCriterion: PropTypes.string,
  actions: PropTypes.shape({
    searchSelectSortCriterion: PropTypes.func,
  }),
  width: PropTypes.number,
};

const mapStateToProps = ({ search, responsive }) => ({
  sortCriteria: search.criteria,
  sortDirection: search.sortDirection,
  selectedCriterion: search.selectedCriterion,
  width: responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    searchSelectSortCriterion,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterBarComponent);
