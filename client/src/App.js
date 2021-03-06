import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../node_modules/grommet-css';
import './App.css';
import Tip from 'grommet/components/Tip';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Profile from './components/Profile';
import Post from './components/Post';
import {
  NewPost,
  EditPost,
} from './components/UpdatePost';
import NewCategory from './components/NewCategory';
import Category from './components/Category';
import NotFound from './components/NotFound';
import { responsiveResizeListener } from './actions/responsive';
import { appCloseTip } from './actions/app';
import { userSetLoginActive } from './actions/user';

class AppComponent extends Component {
  componentDidMount() {
    this.unlistenResize = this.props.actions.responsiveResizeListener();
  }
  componentWillUnmount() {
    this.unlistenResize();
  }
  render() {
    const { loginActive, loggedIn, actions, tipText, tipTarget } = this.props;
    return (
      <div className="grommet grommetux-app">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/posts/thread/:id/:title?" component={Post} />
          <Route
            path="/posts/comment/:id/:commentId"
            render={routeProps => <Post commentView {...routeProps} />}
          />
          <Route
            path="/posts/new"
            render={(props) => {
              let el;
              if (!loggedIn) {
                el = <Redirect to={{ pathname: '/' }} />;
                actions.userSetLoginActive(true);
              } else {
                el = <NewPost {...props} />;
              }
              return el;
            }}
          />
          <Route
            path="/posts/edit/:id"
            render={(props) => {
              let el;
              if (!loggedIn) {
                el = <Redirect to={{ pathname: '/' }} />;
                actions.userSetLoginActive(true);
              } else {
                el = <EditPost {...props} />;
              }
              return el;
            }}
          />
          <Route path="/categories/category/:category" component={Category} />
          <Route
            path="/categories/create"
            render={(props) => {
              let el;
              if (!loggedIn) {
                el = <Redirect to={{ pathname: '/' }} />
                actions.userSetLoginActive(true);
              } else {
                el = <NewCategory />;
              }
              return el;
            }} />
          <Route component={NotFound} />
        </Switch>
        {loginActive && <Login />}
        <Profile />
        <Footer />
        {
          tipTarget &&
            <Tip
              fill
              onClose={() => {
                actions.appCloseTip();
              }}
              target={tipTarget}
              colorIndex="accent-1"
            >
              {tipText}
            </Tip>
        }
      </div>
    );
  }
}

AppComponent.propTypes = {
  actions: PropTypes.shape({
    responsiveResizeListener: PropTypes.func,
    userSetLoginActive: PropTypes.func,
  }),
};

const mapStateToProps = ({ user, app }) => ({
  loggedIn: user.loggedIn,
  loginActive: user.loginActive,
  tipText: app.tipText,
  tipTarget: app.tipTarget,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    responsiveResizeListener,
    appCloseTip,
    userSetLoginActive,
  }, dispatch),
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default withRouter(App);
