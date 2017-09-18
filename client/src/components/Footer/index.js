import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import LoginIcon from 'grommet/components/icons/base/Login';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import UserIcon from 'grommet/components/icons/base/ContactInfo';
import { userLogout, userSetLoginActive } from '../../actions/user';
import { profileSetUser } from '../../actions/profile';
import { getUsername } from '../../selectors/user';

const AppFooter = ({ width, loggedIn, actions, username }) =>  {
  const isMobile = width < 500;
  return (
    <Footer primary justify="end" className="main-footer">
      {
        loggedIn &&
          <Button
            plain
            label={!isMobile ? 'Post' : null}
            path="/posts/new"
            icon={<AddIcon />}
          />
      }
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
