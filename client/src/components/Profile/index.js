import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layer from 'grommet/components/Layer';
import ProfileDetails from './ProfileDetails';
import { userSetProfilePreviewActive } from '../../actions/user';
import { getUserName } from '../../selectors/user';

const Profile = ({
  username,
  actions,
  profilePreviewActive,
}) => {
  if (!username) return null;
  return (
    <Layer
      closer
      hidden={!profilePreviewActive}
      onClose={() => {
        actions.userSetProfilePreviewActive(false);
      }}
      className="profile-layer"
    >
      <ProfileDetails />
    </Layer>
  );
};

Profile.propTypes = {
  actions: PropTypes.shape({
    userSetProfilePreviewActive: PropTypes.func,
  }),
  profilePreviewActive: PropTypes.bool,
  userVotesGivenMax: PropTypes.number,
  userVotesGivenSeries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  userTimeSinceCreation: PropTypes.string,
  height: PropTypes.number,
};

const mapStateToProps = ({ user }) => ({
  profilePreviewActive: user.profilePreviewActive,
  username: getUserName(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    userSetProfilePreviewActive,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
