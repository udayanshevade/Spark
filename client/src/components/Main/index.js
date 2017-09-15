import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Categories from '../Categories';
import Posts from '../Posts';
import { categoriesLoadData } from '../../actions/categories';
import { postsLoadData } from '../../actions/posts';

const components = {
  'categories': <Categories />,
  'posts': <Posts />,
};

export class Main extends Component {
  componentDidMount() {
    this.loadData();
  }
  loadData() {
    const { actions } = this.props;
    actions.categoriesLoadData();
    actions.postsLoadData();
  }
  render() {
    const { filters, activeFilter } = this.props;
    return (
      <Box pad={{ vertical: 'none' }} className="main-container">
        {components[filters[activeFilter]]}
      </Box>
    );
  }
}

Main.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
  activeFilter: PropTypes.number,
};

const mapStateToProps = ({ search }) => ({
  filters: search.filters,
  activeFilter: search.activeFilter,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    categoriesLoadData,
    postsLoadData,
  }, dispatch),
});

const MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainContainer;
