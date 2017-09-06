import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as categoriesActions from '../../actions/categories';

export const CategoriesComponent = ({ categories, actions, active }) => (
  <span />
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
