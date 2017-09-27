import * as types from '../actions/types';

export const initialState = {
  data: {
    body: '',
    parentId: null,
    ancestorId: null,
  },
};

const comment = (state = initialState, action) => {
  switch (action.type) {
    case types.COMMENT_UPDATE_BODY: {
      const { body } = action;
      return {
        ...state,
        data: {
          ...state.data,
          body,
        },
      };
    }
    case types.COMMENT_RESET_DATA: {
      return {
        ...state,
        data: initialState.data,
      };
    }
    default:
      return state;
  }
};

export default comment;
