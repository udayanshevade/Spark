import * as types from '../actions/types';

export const initialState = {
  menuOpen: false,
  title: 'Spark',
};

const navbar = (state = initialState, action) => {
  switch(action.type) {
    case types.NAVBAR_TOGGLE_MENU:
      const { menuOpen } = action;
      return { ...state, menuOpen };
    case types.NAVBAR_SET_TITLE:
      const { title } = action;
      return { ...state, title };
    default:
      return state;
  }
};

export default navbar;
