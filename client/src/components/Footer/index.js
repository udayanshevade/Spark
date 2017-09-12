import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import LoginIcon from 'grommet/components/icons/base/Login';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import { userLogout, userSetLoginActive } from '../../actions/user';

const AppFooter = ({ width, loggedIn, actions }) =>  {
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
      />
    </Footer>
  );
};

AppFooter.propTypes = {
  loggedIn: PropTypes.bool,
  width: PropTypes.number,
};

const mapStateToProps = ({ user, responsive }) => ({
  loggedIn: user.loggedIn,
  width: responsive.width,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userLogout,
    userSetLoginActive,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);
