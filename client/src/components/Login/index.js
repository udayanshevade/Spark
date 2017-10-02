import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layer from 'grommet/components/Layer';
import LoginForm from 'grommet/components/LoginForm';
import Button from 'grommet/components/Button';
import {
  userLogin,
  userSetLoginActive,
  userSelectLoginForm,
  userResetLoginForm,
} from '../../actions/user';

class Login extends Component {
  componentWillUnmount() {
    this.props.actions.userResetLoginForm();
  }
  render() {
    const { defaultValues, actions, loginActive, loginForm, isLoggingIn } = this.props;
    const isLogin = loginForm === 'login';
    return (
      <Layer
        closer
        hidden={!loginActive}
        onClose={() => {
          actions.userSetLoginActive(false);
        }}
      >
        <LoginForm
          defaultValues={defaultValues}
          onSubmit={isLoggingIn ? null : actions.userLogin}
          title={loginForm}
          secondaryText={
            <span>
              {isLogin ? 'Don\'t have an account?' : 'Already got an account?'}
              <Button
                plain
                label={isLogin ? 'Create one.' : 'Login.'}
                onClick={() => {
                  const updatedForm = loginForm === 'login' ? 'signup' : 'login';
                  actions.userSelectLoginForm(updatedForm);
              }} />
            </span>
          }
          usernameType="text"
          align="start"
        />
      </Layer>
    );
  }
};

Login.propTypes = {
  actions: PropTypes.shape({
    userSetLoginActive: PropTypes.func,
    userSelectLoginForm: PropTypes.func,
    userLogin: PropTypes.func,
  }),
  loginActive: PropTypes.bool,
  loginForm: PropTypes.string,
};

const mapStateToProps = ({ user }) => ({
  isLoggingIn: user.isLoggingIn,
  loginActive: user.loginActive,
  loginForm: user.loginForm,
  defaultValues: user.defaultValues,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userLogin,
    userSetLoginActive,
    userSelectLoginForm,
    userResetLoginForm,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
