import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {toastr} from '../../helpers/helper';

import firebase from 'firebase';

class Register extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  registerAsync = async () => {
    const {name, email, password} = this.state;

    let error = false;

    try {
      if (name.trim() === '') {
        error = true;
        throw new Error('Name is Required.');
      }

      if (name.trim().length < 3) {
        error = true;
        throw new Error('Name Minimum 3 Character.');
      }

      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      firebase
        .database()
        .ref('users')
        .child(response.user.uid)
        .set({
          name,
          email,
          uid: response.user.uid,
        });

      await AsyncStorage.setItem('userToken', response.user.uid);

      this.props.navigation.navigate('Login');
    } catch (error) {
      toastr(error.message, 'danger');
    }
  };

  handleChange = key => value => {
    this.setState({[key]: value});
  };

  renderRegisterButton = () => {
    return (
      <TouchableOpacity
        style={styles.btnRegister}
        onPress={() => this.registerAsync()}
        underlayColor="#325b84">
        <Text style={styles.registerText}> Sign Up </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ImageBackground
        style={styles.image}
        source={require('../../assets/logo1.jpg')}>
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <TextInput
              value={this.state.name}
              onChangeText={this.handleChange('name')}
              placeholder="Name"
              placeholderTextColor="#294158"
              style={styles.textInput}
            />
            <TextInput
              value={this.state.email}
              onChangeText={this.handleChange('email')}
              placeholder="Email"
              placeholderTextColor="#294158"
              style={styles.textInput}
            />
            <TextInput
              value={this.state.password}
              onChangeText={this.handleChange('password')}
              placeholder="Password"
              placeholderTextColor="#294158"
              style={styles.textInput}
              secureTextEntry={true}
            />

            <View style={styles.btnSignUp}>{this.renderRegisterButton()}</View>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.textLogin}>
                Already have account ? Sign In »
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#d6dce2',
    padding: 10,
  },
  formGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#eaedf0',
    borderRadius: 7,
    paddingHorizontal: 16,
    marginVertical: 10,
    fontSize: 16,
    color: '#294158',
  },
  btnRegister: {
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#24394d',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#24394d',
  },
  textLogin: {
    textAlign: 'center',
    color: '#A0A0A0',
    paddingTop: 15,
    fontSize: 20,
    // color: 'orange',
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Register;
