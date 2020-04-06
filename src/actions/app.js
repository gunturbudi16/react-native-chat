import firebase from 'firebase';
import base64 from 'base-64';
import _ from 'lodash';

import {
  ADD_CONTACT,
  ADD_NEW_CONTACT_ERROR,
  ADD_NEW_CONTACT_SUCCESS,
  CONTACTS_LIST,
  CHANGE_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  LIST_CONVERSATION_USER,
  GET_CHATS,
} from './types';

export const addContact = email => async dispatch => {
  dispatch({
    type: ADD_CONTACT,
    payload: email,
  });
};

export const registerNewContact = email => async dispatch => {
  const email = base64.encode(email);

  try {
    const snapshot = await firebase
      .database()
      .ref(`/users/${email}`)
      .once('value');

    const user = _.first(_.values(snapshot.val()));

    const {currentUser} = firebase.auth();
    const currentEmail = base64.encode(currentUser.email);

    await firebase
      .database()
      .ref(`/users_of_contacts/${currentEmail}`)
      .push({
        email,
        name: user.name,
      });

    dispatch({
      type: ADD_NEW_CONTACT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: ADD_NEW_CONTACT_ERROR,
      payload: error.message,
    });
  }
};

export const fetchContacts = emailLoggedIn => async dispatch => {
  firebase
    .database()
    .ref(`/users_of_contacts/${emailLoggedIn}`)
    .on('value', snapshot => {
      dispatch({
        type: CONTACTS_LIST,
        payload: snapshot.val(),
      });
    });
};

export const sendMessage = (
  message,
  contactName,
  contactEmail,
) => async dispatch => {
  const {currentUser} = firebase.auth();
  const userEmail = currentUser.email;

  const user_email_encode = base64.encode(userEmail);
  const contact_email_encode = base64.encode(contactEmail);

  firebase
    .database()
    .ref(`/messages/${user_email_encode}/${contact_email_encode}`)
    .push({
      message: message,
      type: 'send',
    })
    .then(() => {
      firebase
        .database()
        .ref(`/messages/${contact_email_encode}/${user_email_encode}`)
        .push({
          message: message,
          type: 'receive',
        })
        .then(() =>
          dispatch({
            type: SEND_MESSAGE_SUCCESS,
          }),
        );
    })
    .then(() => {
      firebase
        .database()
        .ref(`/user_conversations/${user_email_encode}/${contact_email_encode}`)
        .set({
          name: contactName,
          email: contactEmail,
          lastMessage: message,
        });
    })
    .then(() => {
      firebase
        .database()
        .ref(`/users/${user_email_encode}`)
        .once('value')
        .then(snapshot => {
          const dataUser = _.first(_.values(snapshot.val()));
          firebase
            .database()
            .ref(
              `/user_conversations/${contact_email_encode}/${user_email_encode}`,
            )
            .set({
              name: dataUser.name,
              email: userEmail,
              lastMessage: message,
            });
        });
    });
};

export const getChats = () => async dispatch => {
  firebase
    .database()
    .ref('/user_conversations/gunturkurniawan238@gmail.com')
    .on('value', user_conversations => {
      firebase
        .database()
        .ref('/users_of_contacts/gunturkurniawan238@gmail.com')
        .on('value', users_of_contacts => {
          const contacts = _.map(users_of_contacts.val(), (value, uid) => {
            return {...value, uid};
          });

          const conversations = _.map(
            user_conversations.val(),
            (value, uid) => {
              return {...value, uid};
            },
          );

          let array_merged = [];
          let count = 0;
          let i = 0;
          let y = 0;

          for (i = 0; i < conversations.length; i++) {
            for (y = 0; y < contacts.length; y++) {
              if (conversations[i].email === contacts[y].email) {
                array_merged[count] = {...conversations[i], ...contacts[y]};
                count++;
              }
            }
          }

          dispatch({
            type: GET_CHATS,
            payload: array_merged,
          });
        });
    });
};

export const fetchMessages = contactEmail => async dispatch => {
  const {currentUser} = firebase.auth();
  let user_email_encode = base64.encode(currentUser.email);
  let contact_email_encode = base64.encode(contactEmail);

  firebase
    .database()
    .ref(`/messages/${user_email_encode}/${contact_email_encode}`)
    .on('value', snapshot => {
      dispatch({
        type: LIST_CONVERSATION_USER,
        payload: snapshot.val(),
      });
    });
};

export const registerNewContactError = error => async dispatch => {
  dispatch({
    type: ADD_NEW_CONTACT_ERROR,
    payload: error.message,
  });
};

export const registerNewContactSuccess = () => async dispatch =>
  dispatch({
    type: ADD_NEW_CONTACT_SUCCESS,
    payload: true,
  });

export const enableInclusionContact = () => async dispatch =>
  dispatch({
    type: ADD_NEW_CONTACT_SUCCESS,
    payload: false,
  });

// export const changeMessage = (text = async dispatch => {
//   return {
//     type: CHANGE_MESSAGE,
//     payload: text,
//   };
// });
