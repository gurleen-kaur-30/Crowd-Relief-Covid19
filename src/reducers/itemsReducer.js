import {ALL_ITEMS, ITEMS_LOADING, ITEM_CHANGED} from '../actions/types';

const INITIAL_STATE = {
  all_items: null,
  loading: false,
  changed:[]
};

export default function(state = INITIAL_STATE, action) {
  let result = Object.assign({}, state);
  switch (action.type) {
    case ALL_ITEMS:
      let changed = []
      action.all_items.map(() => {
          changed.push(false)
      })
      return {
        ...result,
        all_items: action.all_items,
        changed: changed
      };
    case ITEMS_LOADING:
      return {
        ...result,
        loading: action.loading,
      };
    case ITEM_CHANGED:{
      var changedNew = state.changed
      if(action.index!=-1) {
          changedNew[action.index] = !changedNew[action.index];
      }
      return{
        ...result,
        changed: changedNew
      }
    }
    default:
      return state;
  }
}
