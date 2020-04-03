import base64 from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';

import {toastr} from '../helpers/helper';

import {
  HANDLE_NAME,
  HANDLE_EMAIL,
  HANDLE_PHONE,
  HANDLE_PASSWORD,
  CHANGE_VALUE_PHONE,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from './types';

import firebase from 'firebase';

export const handleName = name => async dispatch => {
  dispatch({
    type: HANDLE_NAME,
    payload: name,
  });
};
export const handleEmail = email => async dispatch => {
  dispatch({
    type: HANDLE_EMAIL,
    payload: email,
  });
};
export const handlePhone = phone => async dispatch => {
  dispatch({
    type: HANDLE_PHONE,
    payload: phone,
  });
};
export const handlePassword = password => async dispatch => {
  dispatch({
    type: HANDLE_PASSWORD,
    payload: password,
  });
};
export const changeValuePhone = phone => async dispatch => {
  dispatch({
    type: CHANGE_VALUE_PHONE,
    payload: phone,
  });
};
export const login = (data, navigation) => async dispatch => {
  const email = data.email;
  const password = data.password;
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    await AsyncStorage.setItem('userToken', base64.encode(email));
    dispatch({type: LOGIN_SUCCESS});
    navigation.navigate('App');
    toastr('Succesfully Login !', 'success');
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    toastr(error.message, 'danger');
  }
};
export const register = (data, navigation) => async dispatch => {
  try {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    const EmailEncode = base64.encode(email);
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase
      .database()
      .ref(`/users/${EmailEncode}`)
      .push({name});
    dispatch({
      type: REGISTER_SUCCESS,
    });
    navigation.navigate('Login');
    toastr('Succesfully Register !', 'success');
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
    toastr(error.message, 'danger');
  }
};
