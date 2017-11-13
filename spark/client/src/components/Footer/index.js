import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import NewIcon from 'grommet/components/icons/base/New';
import LoginIcon from 'grommet/components/icons/base/Login';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import UserIcon from 'grommet/components/icons/base/ContactInfo';
import { userLogout, userSetLoginActive } from '../../actions/user';
import { profileSetUser } from '../../actions/profile';
import { appShowTipWithText } from '../../actions/app';
import { getUsername } from '../../selectors/user';
import { getIsMobile } from '../../selectors/responsive';

const AppFooter = ({ width, loggedIn, actions, username, isMobile }) =>  (
  <Footer primary justify="end" className="main-footer">
    <Button
      plain
      label={!isMobile ? 'Post' : null}
      path={loggedIn ? '/posts/new' : null}
      onClick={
        loggedIn
          ? null
          : () => {
            actions.appShowTipWithText(
              'Login to submit a new post.',
              'footer-login-button'
            );
          }
      }
      icon={<NewIcon />}
    />
    {
      loggedIn &&
        <Button
          plain
          label={!isMobile ? 'Profile' : null}
          icon={<UserIcon />}
          onClick={() => {
            actions.profileSetUser(username);
          }}
        />
    }
    <Button
      plain
      label={!isMobile ? `Log ${loggedIn ? 'out' : 'in'}` : null}
      icon={loggedIn ? <LogoutIcon /> : <LoginIcon />}
      onClick={() => {
        if (loggedIn) {
          actions.userLogout();
        } else {
          actions.userSetLoginActive(true);
        }
      }}
      id="footer-login-button"
    />
  </Footer>
);

AppFooter.propTypes = {
  loggedIn: PropTypes.bool,
  width: PropTypes.number,
  username: PropTypes.string,
  isMobile: PropTypes.bool,
};

const mapStateToProps = ({ user, responsive }) => ({
  loggedIn: user.loggedIn,
  username: getUsername(user),
  isMobile: getIsMobile(responsive),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userLogout,
    userSetLoginActive,
    profileSetUser,
    appShowTipWithText,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);
