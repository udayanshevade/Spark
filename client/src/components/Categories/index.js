import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Menu } from 'semantic-ui-react';
import * as categoriesActions from '../../actions/categories';

export const CategoriesComponent = ({ categories, actions, active }) => (
  <Grid.Column
    width={4}
  >
    <Menu fluid vertical tabular="right">
      <Menu.Item
        name="all"
        active={active===''}
        onClick={() => { actions.categoriesSetActive(''); }}
      />
      {
        categories.map(category => {
          const { name: cat } = category;
          return (
            <Menu.Item
              name={cat}
              active={active === cat}
              onClick={(e, { name }) => { actions.categoriesSetActive(name); }}
              key={`menu-item-${cat}`}
            />
          );
        })
      }
    </Menu>
  </Grid.Column>
);

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

const mapStateToProps = state => ({
  categories: state.categories.categories,
  active: state.categories.active,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...categoriesActions,
  }, dispatch),
});

const Categories = connect(mapStateToProps, mapDispatchToProps)(CategoriesComponent);

export default Categories;
