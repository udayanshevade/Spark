import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from 'grommet/components/Box';
import Subscribe from './Subscribe';
import Posts from '../Posts';
import Blurb from '../Blurb';
import { searchFilterUpdate } from '../../actions/search';
import { postsUpdate, postsLoadData, postsUpdateOffset } from '../../actions/posts';
import {
  categoriesLoadCategoryData,
  categoriesToggleBlurbExpanded,
} from '../../actions/categories';
import {
  getCategoryBlurb,
  getCategorySubscribers,
} from '../../selectors/categories';
import { getUserSubscribed } from '../../selectors/user';
import { userSubscribeCategory } from '../../actions/user';

class Category extends Component {
  componentDidMount() {
    const { match } = this.props;
    const { category } = match.params;
    this.props.actions.searchFilterUpdate(1);
    this.props.actions.postsUpdateOffset(0);
    this.props.actions.postsUpdate([]);
    this.props.actions.categoriesLoadCategoryData(category);
    this.props.actions.postsLoadData('', category);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== this.props.match.params.category) {
      this.props.actions.postsUpdateOffset(0);
    }
  }
  componentWillUnmount() {
    this.props.actions.postsUpdate([]);
    this.props.actions.postsUpdateOffset(0);
  }
  render() {
    const {
      match,
      blurb,
      blurbExpanded,
      blurbLimit,
      actions,
      subscribers,
      userSubscribed,
      loggedIn,
    } = this.props;
    return (
      <Box pad={{ vertical: 'none' }} className="main-container">
        <Subscribe
          subscribers={subscribers}
          category={match.params.category}
          userSubscribed={userSubscribed}
          toggleSubscribe={actions.userSubscribeCategory}
          loggedIn={loggedIn}
        />
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
    user,
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
  subscribers: getCategorySubscribers(categories, category),
  userSubscribed: getUserSubscribed(user, category),
  loggedIn: user.loggedIn,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postsLoadData,
    postsUpdate,
    postsUpdateOffset,
    searchFilterUpdate,
    categoriesLoadCategoryData,
    categoriesToggleBlurbExpanded,
    userSubscribeCategory,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
