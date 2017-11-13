import React from 'react';
import PropTypes from 'prop-types';
import Button from 'grommet/components/Button';

const ProfileButton = ({ author, icon, profileSetUser }) => {
  return (
    <Button
      plain
      label={author}
      icon={icon}
      onClick={() => {
        profileSetUser(author);
      }}
      className="profile-preview-button"
    />
  );
};

ProfileButton.propTypes = {
  author: PropTypes.string,
  icon: PropTypes.element,
  profileSetUser: PropTypes.func,
};

export default ProfileButton;
