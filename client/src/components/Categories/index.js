import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Anchor from 'grommet/components/Anchor';
import Spinning from 'grommet/components/icons/Spinning';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import * as categoriesActions from '../../actions/categories';

export const CategoriesComponent = ({ loading, categories, actions, active }) => {
  let categoriesEl;
  if (loading) {
    categoriesEl = <Spinning className="loading-spinner"/>;
  } else if (!categories.length) {
    categoriesEl = (
      <ListPlaceHolder
        filteredTotal={categories.length}
      />
    );
  } else {
    categoriesEl = (
      <List>
        {categories.map(({ name, path }, i) => (
          <ListItem
            separator="horizontal"
            key={`list-category-item-${i}`}
          >
            <Anchor
              icon={<CaretDownIcon size="xsmall" />}
              path={`./categories/${path}`}
              label={name}
            />
          </ListItem>
        ))}
      </List>
    );
  }
  return categoriesEl;
}

CategoriesComponent.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  actions: PropTypes.shape({
    categoriesSetActive: PropTypes.func,
  }),
  activeCategory: PropTypes.string,
};

const mapStateToProps = ({ categories }) => ({
  loading: categories.loading,
  categories: categories.categories,
  active: categories.active,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...categoriesActions,
  }, dispatch),
});

const Categories = connect(mapStateToProps, mapDispatchToProps)(CategoriesComponent);

export default Categories;
