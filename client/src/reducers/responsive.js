import * as types from '../actions/types';

export const initialState = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
};

const responsiveReducer = (state = initialState, action) => {
  switch(action.type) {
    case types.WINDOW_RESIZE: {
      const { width, height } = action;
      return { ...state, width, height };
    }
    default: {
      return state;
    }
  }
};

export default responsiveReducer;
