import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../node_modules/grommet-css';
import './App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
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
        <Route path="/" component={Navbar} />
        <Route exact path="/" component={Main} />
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

export default App;
