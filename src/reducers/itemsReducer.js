import {ALL_ITEMS, ITEMS_LOADING} from '../actions/types';

const INITIAL_STATE = {
  all_items: null,
  loading: false,
};

export default function(state = INITIAL_STATE, action) {
  let result = Object.assign({}, state);
  switch (action.type) {
    case ALL_ITEMS:
      return {
        ...result,
        all_items: action.all_items,
      };
    case ITEMS_LOADING:
      return {
        ...result,
        loading: action.loading,
      };
    default:
      return state;
  }
}
