import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../node_modules/grommet-css';
import './App.css';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Profile from './components/Profile';
import Post from './components/Post';
import Category from './components/Category';
import { responsiveResizeListener } from './actions/responsive';

class AppComponent extends Component {
  componentDidMount() {
    this.unlistenResize = this.props.actions.responsiveResizeListener();
  }
  componentWillUnmount() {
    this.unlistenResize();
  }
  render() {
    return (
      <div className="grommet grommetux-app">
        <Route exact path="/" component={Main} />
        <Route path="/" component={Login} />
        <Route path="/" component={Profile} />
        <Route path="/" component={Footer} />
        <Route path="/posts/:id" component={Post} />
        <Route path="/categories/:category" component={Category} />
      </div>
    );
  }
}

AppComponent.propTypes = {
  actions: PropTypes.shape({
    responsiveResizeListener: PropTypes.func,
  }),
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    responsiveResizeListener,
  }, dispatch),
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default withRouter(App);
