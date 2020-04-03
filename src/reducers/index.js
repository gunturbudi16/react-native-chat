import {combineReducers} from 'redux';
import auth from './auth';
import listchat from './listchat';
import app from './app';
import listcontact from './listcontact';
export default combineReducers({
  auth,
  app,
  listchat,
  listcontact,
});
