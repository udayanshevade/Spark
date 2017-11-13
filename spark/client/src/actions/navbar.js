import * as types from './types';

export const navbarToggleMenu = menuOpen => ({
  type: types.NAVBAR_TOGGLE_MENU,
  menuOpen,
});

export const navbarSetTitle = title => ({
  type: types.NAVBAR_SET_TITLE,
  title,
});
