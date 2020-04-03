const initialState = {};

import {CONTACTS_LIST} from '../actions/types';

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case CONTACTS_LIST:
      return payload;
    default:
      return state;
  }
};
