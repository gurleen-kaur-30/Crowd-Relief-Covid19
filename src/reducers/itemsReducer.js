import {ALL_ITEMS, ITEMS_LOADING} from '../actions/types';

const INITIAL_STATE = {
  all_items: null,
  loading: false,
  changed: [],
};

export default function(state = INITIAL_STATE, action) {
  let result = Object.assign({}, state);
  switch (action.type) {
    case ALL_ITEMS:
      let changed = [];
      action.all_items.map(() => {
        changed.push(false);
      });
      return {
        ...result,
        all_items: action.all_items,
        changed: changed,
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
