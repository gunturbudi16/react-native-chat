import React, {Component} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {
  SafeAreaView,
  ScrollView,
  Text,
  AsyncStorage,
  Image,
  View,
  Button,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import {Header} from 'react-navigation';

import User from '../auth/User';

import {toastr} from '../../helpers/helper';

import firebase from 'firebase';

class Profile extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      status: '',
      bio: '',
      imageSource: require('../../assets/user.png'),
      upload: false,
    };
  }

  async _getProfile() {
    this._isMounted = true;

    const uid = await AsyncStorage.getItem('userToken');

    const {navigation} = this.props;

    const person = await firebase.database().ref(`users/${uid}`).once('value');

    const image = person.val().image;
    const name = person.val().name;
    const status = person.val().status;
    const bio = person.val().bio;

    if (this._isMounted) {
      this.setState({
        imageSource: image ? {uri: image} : require('../../assets/user.png'),
        name: name ? name : '',
        status: status ? status : '',
        bio: bio ? bio : '',
      });
    }
  }

  componentDidMount() {
    this._getProfile();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _signout = async (props) => {
    await AsyncStorage.clear();

    this.props.navigation.navigate('Login');
  };

  _handleChange = (key) => (value) => {
    this.setState({[key]: value});
  };

  _saveProfile = async () => {
    let error = false;

    try {
      if (this.state.name.trim() === '') {
        error = true;
        throw new Error('Please enter valid Name.');
      }

      if (this.state.name.length < 3) {
        error = true;
        throw new Error('Name Minimum Character 3 length.');
      }

      if (this.state.status.trim() === '') {
        error = true;
        throw new Error('Status is Required.');
      }

      if (this.state.bio.length < 10) {
        error = true;
        throw new Error('Bio Minimum Character 10 length.');
      }

      if (error === false) {
        this.updateUser();
      }
    } catch (error) {
      toastr(error.message, 'danger');
    }
  };

  _changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      try {
        if (!response.didCancel && !response.error) {
          const {fileName, fileSize} = response;
          const isValid = this.validateImage(fileName, fileSize);

          if (isValid) {
            this.setState(
              {
                upload: true,
                imageSource: {
                  uri: response.uri,
                },
              },
              this.uploadedFile,
            );
          }
        }
      } catch (error) {
        toastr(error.message, 'danger');
      }
    });
  };

  validateImage(fileName, fileSize) {
    const split = fileName.split('.');
    const ext = split[split.length - 1].toLocaleLowerCase();
    const acceptableExts = ['png', 'jpg', 'jpeg'];
    if (this.validExtension(ext, acceptableExts) !== true) {
      toastr('Invalid image extension.', 'danger');
    } else if (fileSize >= 102400) {
      toastr('Image too large. Max: 1mb', 'danger');
    } else {
      return true;
    }
  }

  validExtension(ext, acceptableExts) {
    for (const acceptExt of acceptableExts) {
      if (acceptExt === ext) {
        return true;
      }
    }

    return false;
  }

  updateUser = async (imageUrl) => {
    const {imageSource, name, status, bio} = this.state;
    const {currentUser} = firebase.auth();

    const getDBImage = await firebase
      .database()
      .ref(`/users/${currentUser.uid}`)
      .once('value');

    firebase
      .database()
      .ref(`users/${currentUser.uid}`)
      .update({
        image: imageUrl
          ? imageUrl
          : getDBImage.val().image
          ? getDBImage.val().image
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_isWgOJHA7YNXAhKDE5h12SW2l91gIYU9YfZTisz4KItXN18U&s',
        name: name ? name : '',
        status: status ? status : '',
        bio: bio ? bio : '',
      });

    toastr('Successfully updated !', 'success');
  };

  updateUserImage = (imageUrl) => {
    this.updateUser(imageUrl);
    this.setState({
      upload: false,
      imageSource: {
        uri: imageUrl,
      },
    });
  };

  uploadedFile = async () => {
    const {currentUser} = firebase.auth();
    const file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile_picture/${currentUser.uid}.png`)
      .put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => this.updateUserImage(url))
      .catch((error) => {
        this.setState({
          upload: false,
          imageSource: require('../../assets/user.png'),
        });
      });
  };

  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Error on upload image'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#d6dce2',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={this._changeImage}>
          {this.state.upload ? (
            <ActivityIndicator size="large" />
          ) : (
            <Image
              style={{
                borderRadius: 100,
                width: 80,
                height: 80,
                resizeMode: 'cover',
              }}
              source={this.state.imageSource}
            />
          )}
        </TouchableOpacity>
        <View style={Style.container}>
          <Text style={Style.label}> Name </Text>
          <TextInput
            style={Style.input}
            placeholder="Name"
            placeholderTextColor="#24394d"
            value={this.state.name}
            onChangeText={this._handleChange('name')}
          />

          <Text style={Style.label}> Status </Text>
          <TextInput
            style={Style.input}
            placeholder="Status"
            onChangeText={this._handleChange('status')}
            value={this.state.status}
          />

          <Text style={Style.label}> Bio </Text>
          <TextInput
            style={Style.input}
            placeholder="Bio"
            placeholderTextColor="#24394d"
            value={this.state.bio}
            onChangeText={this._handleChange('bio')}
            multiline={true}
            numberOfLines={4}
          />

          <TouchableOpacity onPress={this._saveProfile} style={Style.save}>
            <Text style={{color: '#d6dce2'}}> Save </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this._signout} style={Style.logout}>
            <Text style={{color: '#d6dce2'}}> Logout </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const Style = StyleSheet.create({
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  label: {
    marginVertical: 8,
    marginLeft: 26,
    alignSelf: 'flex-start',
  },
  logout: {
    padding: 8,
    marginTop: 10,
    backgroundColor: '#ff5065',
    alignItems: 'center',
    width: '80%',
    borderRadius: 7,
  },
  save: {
    padding: 8,
    backgroundColor: '#294158',
    marginTop: 12,
    alignItems: 'center',
    width: '80%',
    borderRadius: 7,
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#34526e',
    color: '#24394d',
    width: '80%',
    borderRadius: 5,
  },
});

export default Profile;
