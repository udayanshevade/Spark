import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const NavbarComponent = ({ title }) => (
  <AppBar
    title={title}
    titleStyle={styles.title}
    showMenuIconButton={false}
    iconElementRight={
      <FlatButton label="Login" />
    }
  />
);

const styles = {
  title: {
    textAlign: 'left',
    fontSize: '2rem',
  },
}

NavbarComponent.propTypes = {
  title: PropTypes.string,
};

const mapStateToProps = state => ({
  title: state.navbar.title,
});

export default connect(mapStateToProps)(NavbarComponent);
