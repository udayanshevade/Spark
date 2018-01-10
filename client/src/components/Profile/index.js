import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layer from 'grommet/components/Layer';
import ProfileDetails from './ProfileDetails';
import { profileReset } from '../../actions/profile';
import { getProfileName } from '../../selectors/profile';

const Profile = ({
  username,
  actions,
  previewActive,
}) => {
  if (!username) return null;
  return (
    <Layer
      closer
      hidden={!previewActive}
      onClose={() => {
        actions.profileReset();
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
  previewActive: PropTypes.bool,
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

const mapStateToProps = ({ profile }) => ({
  previewActive: profile.previewActive,
  username: getProfileName(profile),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    profileReset,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
