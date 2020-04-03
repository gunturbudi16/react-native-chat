import {
  ADD_CONTACT,
  ADD_NEW_CONTACT_ERROR,
  ADD_NEW_CONTACT_SUCCESS,
  CHANGE_MESSAGE,
  SEND_MESSAGE_SUCCESS,
} from '../actions/types';

const initialState = {
  email_logged_in: 'gunturkurniawan238@gmail.com',
  email_contact: 'gunturkurniawan238@gmail.com',
  add_contact_error: '',
  add_contact_status: true,
  message: '',
};

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case ADD_CONTACT:
      return {
        ...state,
        email_contact: payload,
      };
    case ADD_NEW_CONTACT_SUCCESS:
      return {
        ...state,
        add_contact_status: payload,
        email_contact: '',
        add_contact_error: '',
      };
    case ADD_NEW_CONTACT_ERROR:
      return {
        ...state,
        add_contact_error: payload,
      };
    case CHANGE_MESSAGE:
      return {
        ...state,
        message: payload,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        message: '',
      };
    default:
      return state;
  }
};
