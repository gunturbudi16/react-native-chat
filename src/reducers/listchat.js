import {GET_CHATS} from '../actions/types';

const initialState = {
  chats: [],
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case GET_CHATS:
      return {
        ...state,
        chats: payload,
      };
    default:
      return state;
  }
}
