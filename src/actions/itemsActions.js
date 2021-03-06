import {ALL_ITEMS, ITEMS_LOADING} from './types';
import {handleError} from './errorAction';
import firebase from 'react-native-firebase';

export const getAllItems = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('items')
        .on('value', snap => {
          dispatch(itemsLoading(true));
          var all_items = [];
          // get children as an array
          snap.forEach(child => {
            all_items.push({
              key: child.key,
              value: child.val(),
            });
          });
          console.log(all_items);
          dispatch(retrieveAllItems(all_items));
          dispatch(itemsLoading(false));
          resolve();
        });
    });
  };
};

function itemsLoading(bool) {
  return {
    type: ITEMS_LOADING,
    loading: bool,
  };
}

function retrieveAllItems(data) {
  return {
    type: ALL_ITEMS,
    all_items: data,
  };
}
