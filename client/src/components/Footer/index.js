import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import LoginIcon from 'grommet/components/icons/base/Login';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import UserIcon from 'grommet/components/icons/base/User';
import { userLogout, userSetLoginActive } from '../../actions/user';
import { profileSetUser } from '../../actions/profile';
import { getUsername } from '../../selectors/user';

const AppFooter = ({ width, loggedIn, actions, username }) =>  {
  const isMobile = width < 500;
  return (
    <Footer primary justify={isMobile ? 'center' : 'end'} className="main-footer">
      <Button
        plain
        label={isMobile ? null : `Log ${loggedIn ? 'out' : 'in'}`}
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
      {
        loggedIn &&
          <Button
            plain
            label={isMobile ? null : 'Profile'}
            icon={<UserIcon />}
            onClick={() => {
              actions.profileSetUser(username);
            }}
          />
      }
    </Footer>
  );
};

AppFooter.propTypes = {
  loggedIn: PropTypes.bool,
  width: PropTypes.number,
  username: PropTypes.string,
};

const mapStateToProps = ({ user, responsive }) => ({
  loggedIn: user.loggedIn,
  width: responsive.width,
  username: getUsername(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userLogout,
    userSetLoginActive,
    profileSetUser,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);
