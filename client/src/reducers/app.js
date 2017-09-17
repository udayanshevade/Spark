import * as types from '../actions/types';

export const initialState = {
  tipText: '',
  tipTarget: null,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case types.APP_SET_TIP_TEXT: {
      const { tipText } = action;
      return { ...state, tipText };
    }
    case types.APP_SET_TIP_TARGET: {
      const { tipTarget } = action;
      return { ...state, tipTarget };
    }
    default:
      return state;
  }
};

export default app;
