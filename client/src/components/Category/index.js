import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Posts from '../Posts';
import Blurb from '../Blurb';
import { searchFilterUpdate } from '../../actions/search';
import { postsLoadData } from '../../actions/posts';
import {
  categoriesLoadCategoryData,
  categoriesToggleBlurbExpanded,
} from '../../actions/categories';
import { getCategoryBlurb } from '../../selectors/categories';

class Category extends Component {
  componentDidMount() {
    const { category } = this.props.match.params;
    this.props.actions.searchFilterUpdate(1);
    this.props.actions.categoriesLoadCategoryData(category);
    this.props.actions.postsLoadData('', category);
  }
  render() {
    const { match, blurb, blurbExpanded, blurbLimit, actions } = this.props;
    return (
      <Box pad={{ vertical: 'none' }} className="main-container">
        <Blurb
          blurb={blurb}
          blurbExpanded={blurbExpanded}
          blurbLimit={blurbLimit}
          toggleBlurbExpanded={actions.categoriesToggleBlurbExpanded}
        />
        <Posts category={match.params.category} />
      </Box>
    );
  }
}

Category.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string,
    }),
  }),
  actions: PropTypes.shape({
    loadPostsByCategory: PropTypes.func,
  }),
};

const mapStateToProps = (
  {
    categories: {
      categories,
      blurbExpanded,
      blurbLimit,
    },
    search,
  },
  {
    match: {
      params: {
        category,
      },
    },
  }
) => ({
  blurbExpanded: blurbExpanded,
  blurbLimit: blurbLimit,
  filters: search.filters,
  activeFilter: search.activeFilter,
  blurb: getCategoryBlurb(categories, category),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postsLoadData,
    searchFilterUpdate,
    categoriesLoadCategoryData,
    categoriesToggleBlurbExpanded,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
