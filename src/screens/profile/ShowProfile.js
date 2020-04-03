import React, {Component} from 'react';

import {Text, Alert} from 'react-native';

import firebase from 'firebase';

class ShowProfile extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      person: {
        imageSource: props.navigation.getParam('image'),
        name: props.navigation.getParam('name'),
        status: props.navigation.getParam('status'),
        bio: props.bio.getParam('bio'),
      },
    };
  }

  // _fetchdata() {
  //
  // }

  componentDidMount() {
    this._isMounted = true;

    // firebase.database().ref(`users`). .orderBy('uid').equalTo('uid').on('child_added', snapshot => {
    //
    // })
  }

  render() {
    return <Text>c</Text>;
  }
}

export default ShowProfile;
