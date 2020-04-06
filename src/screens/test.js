import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
// import Firebase from '../Config/firebase'
import * as firebase from 'firebase';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      imageUrl: '',
      latitude: '',
      longitude: '',
      // status: "",
    };
    this.getProfile(), this.getUserData(), this.updateLocation();
  }
  componentDidMount() {
    const {displayName} = firebase.auth().currentUser;
    this.setState({displayName});
    this.getUserData();
  }

  signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Login');
      });
  };

  getUserData = async () => {
    const uid = firebase.auth().currentUser.uid;
    let ref = firebase.database().ref(`/user/${uid}`);
    ref
      .on('value', (snapshot) => {
        this.setState({
          displayName: snapshot.val() != null ? snapshot.val().displayName : '',
          imageUrl: snapshot.val() != null ? snapshot.val().imageUrl : '',
        });
      })
      .then((res) => {
        res
          ? console.log(statedata, this.state.spesificData)
          : ToastAndroid.showWithGravity(
              'Insert Your Data',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfile = async () => {
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`/user/${uid}`);
    ref.on('value', (snapshot) => {
      this.setState({
        displayName: snapshot.val() != null ? snapshot.val().displayName : '',
        imageUrl: snapshot.val() != null ? snapshot.val().imageUrl : '',
      });
    });
  };

  updateLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location',
      },
    );
    if (granted) {
      await Geolocation.getCurrentPosition(
        async (position) => {
          console.log('My current location', JSON.stringify(position));
          await this.setState({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      // this.watchID = Geolocation.watchPosition(position => {
      //     let region = {
      //         latitude: position.coords.latitude,
      //         longitude: position.coords.longitude,
      //         latitudeDelta: 0.00922 * 1.5,
      //         longitudeDelta: 0.00421 * 1.5,
      //     }
      // })
    }
  };

  handleUpdateLocation = async () => {
    const uid = firebase.auth().currentUser.uid;
    const {displayName, imageUrl, latitude, longitude} = this.state;
    const email = firebase.auth().currentUser.email;
    const ref = firebase.database().ref(`/user/${uid}`);
    setTimeout(async () => {
      await ref.set({
        email,
        uid,
        displayName,
        latitude,
        longitude,
        imageUrl: imageUrl,
      });
      ToastAndroid.showWithGravity(
        `Location Updated`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }, 2000);
  };

  async componentDidMount() {
    const {latitude, longitude} = this.state;
    const uid = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref(`/user/${uid}`);

    await this.updateLocation();
    this.getProfile();
    this.getUserData();
  }

  editHandler = () => {
    this.props.navigation.navigate('editProfile');
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <Text onPress={this.editHandler}>
            <Icon style={{color: 'white'}} name="edit" size={30} />
          </Text>
          <Text onPress={this.signOutUser}>
            <Icon style={{color: 'white'}} name="sign-out" size={30} />
          </Text>
        </View>
        <View style={styles.containerBottom}>
          <Image style={styles.circle} source={{uri: this.state.imageUrl}} />
          <Text style={styles.text}>Hi, {this.state.displayName}</Text>
        </View>
      </View>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e76a8',
  },
  containerHeader: {
    padding: 40,
    height: '30%',
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'pink'
  },
  containerBottom: {
    padding: 40,
    top: 100,
    width: '100%',
    height: '70%',
    flexDirection: 'column',
    // alignItems: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    // backgroundColor: '#262626',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -250,
  },
  text: {
    top: -220,
    fontSize: 35,
  },
  saveButton: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#262626',
    borderRadius: 15,
    padding: 15,
  },
});
