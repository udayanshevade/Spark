import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'grommet/components/Menu';
import SwitchIcon from 'grommet/components/icons/base/Compare';
import Button from 'grommet/components/Button';

const FilterSelect = ({ filters, activeFilter, searchFilterUpdate }) => (
  <Menu
    icon={<SwitchIcon className="switch-type-icon" />}
    dropAlign={{ right: 'right' }}
  >
    {
      filters.map((filter, i) => (
        <Button
          plain
          label={filter}
          onClick={() => {
            searchFilterUpdate(i);
          }}
          style={{
            ...(filter === filters[activeFilter] ? styles.activeFilter : styles.filter),
          }}
          key={`search-filter-${filter}`}
        />
      ))
    }
  </Menu>
);

FilterSelect.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
  activeFilter: PropTypes.number,
  searchFilterUpdate: PropTypes.func,
};

const styles = {
  filter: {
    textAlign: 'right',
  },
  activeFilter: {
    textAlign: 'right',
    backgroundColor: '#fff',
  },
};

export default FilterSelect;
