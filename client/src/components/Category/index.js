import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Posts from '../Posts';
import { searchFilterUpdate } from '../../actions/search';
import { postsLoadData } from '../../actions/posts';

class Categories extends Component {
  componentDidMount() {
    this.props.actions.searchFilterUpdate(1);
    this.props.actions.postsLoadData('', this.props.match.params.category);
  }
  render() {
    return (
      <Box pad={{ vertical: 'none' }} className="main-container">
        <Posts category={this.props.match.params.category} />
      </Box>
    );
  }
}

Categories.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      category: PropTypes.string,
    }),
  }),
  actions: PropTypes.shape({
    loadPostsByCategory: PropTypes.func,
  }),
};

const mapStateToProps = ({ search }) => ({
  filters: search.filters,
  activeFilter: search.activeFilter,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postsLoadData,
    searchFilterUpdate,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
