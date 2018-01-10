import * as types from '../actions/types';

const initialValues = {
  name: '',
  blurb: '',
  private: false,
};

export const initialState = {
  query: '',
  submitStatus: 'pending',
  categories: [],
  loading: false,
  active: '',
  initialValues: {
    name: '',
    blurb: '',
    private: false,
  },
  categorySuggestions: {
    query: '',
    results: [],
    timeoutId: null,
    timeoutLength: 750,
    loading: false,
  },
  isCreating: false,
  blurbExpanded: false,
  blurbLimit: 90,
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
    case types.CATEGORIES_SET_SUBMIT_STATUS: {
      const { submitStatus } = action;
      return {
        ...state,
        submitStatus,
      };
    }
    case types.CATEGORIES_SET_LOADING:
      const { loading } = action; 
      return { ...state, loading };
    case types.CATEGORIES_SET_IS_CREATING:
      const { isCreating } = action; 
      return { ...state, isCreating };
    case types.CATEGORIES_UPDATE:
      const { categories } = action;
      return { ...state, categories };
    case types.CATEGORIES_SET_ACTIVE:
      const { active } = action;
      return { ...state, active };
    case types.CATEGORIES_UPDATE_SUGGESTIONS_QUERY: {
      const { query } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          query,
        },
      };
    }
    case types.CATEGORIES_UPDATE_SUGGESTIONS: {
      const { results } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          results,
        },
      };
    }
    case types.CATEGORIES_SUGGESTIONS_SET_TIMEOUT: {
      const { timeoutId } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          timeoutId,
        },
      };
    }
    case types.CATEGORIES_SUGGESTIONS_SET_LOADING: {
      const { loading } = action;
      return {
        ...state,
        categorySuggestions: {
          ...state.categorySuggestions,
          loading,
        },
      };
    }
    case types.CATEGORIES_TOGGLE_BLURB_EXPANDED: {
      const { blurbExpanded } = action;
      return {
        ...state,
        blurbExpanded,
      };
    }
    case types.CATEGORIES_RESET_CREATE_DATA: {
      return {
        ...state,
        initialValues: {
          ...initialValues,
        },
      };
    }
    default:
      return state;
  }
};

export default categories;
