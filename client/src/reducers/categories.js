import * as types from '../actions/types';

export const initialState = {
  query: '',
  categories: [],
  loading: false,
  active: '',
};

const categories = (state = initialState, action) => {
  switch(action.type) {
    case types.CATEGORIES_QUERY_UPDATE: {
      const { query } = action;
      return {
        ...state,
        query,
      };
    }
    case types.CATEGORIES_SET_LOADING:
      const { loading } = action; 
      return { ...state, loading };
    case types.CATEGORIES_UPDATE:
      const { categories } = action;
      return { ...state, categories };
    case types.CATEGORIES_SET_ACTIVE:
      const { active } = action;
      return { ...state, active };
    default:
      return state;
  }
};

export default categories;
