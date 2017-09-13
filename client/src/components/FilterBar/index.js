import React from 'react';
import PropTypes from 'prop-types';
import Header from 'grommet/components/Header';
import Sort from 'grommet-addons/components/Sort';

const FilterBarComponent = ({
  sortCriteria,
  sortDirection,
  selectedCriterion,
  selectSortCriterion,
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
        onChange={selectSortCriterion}
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
    selectSortCriterion: PropTypes.func,
  }),
  width: PropTypes.number,
};

export default FilterBarComponent;
