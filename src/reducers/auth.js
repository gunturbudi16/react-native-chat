import {
  HANDLE_NAME,
  HANDLE_EMAIL,
  HANDLE_PASSWORD,
  HANDLE_PHONE,
  CHANGE_VALUE_PHONE,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from '../actions/types';

const initialState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  message: '',
  loading: false,
};

export default function(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case HANDLE_NAME:
      return {
        ...state,
        name: payload,
      };
    case HANDLE_EMAIL:
      return {
        ...state,
        email: payload,
      };
    case HANDLE_PASSWORD:
      return {
        ...state,
        password: payload,
      };
    case HANDLE_PHONE:
      return {
        ...state,
        phone: payload,
      };
    case CHANGE_VALUE_PHONE:
      return {
        ...state,
        phone: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        email: '',
        password: '',
      };
    case LOGIN_FAIL:
      return {
        ...state,
        messageError: payload,
        isError: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        name: '',
        email: '',
        password: '',
      };
    default:
      return state;
  }
}
