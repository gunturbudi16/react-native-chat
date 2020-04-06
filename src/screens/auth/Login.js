import React from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  AsyncStorage,
  StyleSheet,
} from 'react-native';
import {toastr} from '../../helpers/helper';
import User from './User';
import firebase from 'firebase';

class Login extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  handleChange = key => value => {
    this.setState({[key]: value});
  };
  LoginAsync = async () => {
    const {email, password} = this.state;
    const {navigation} = this.props;
    try {
      if (password.length < 5) {
        toastr('Password must have 5 character', 'danger');
      }
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      firebase
        .database()
        .ref('users')
        .child(response.user.uid)
        .update({
          uid: response.user.uid,
        });
      await AsyncStorage.setItem('userToken', response.user.uid);
      User.uid = response.user.uid;
      /*  firebase
        .database()
        .ref('users/' + User.uid)
        .set({name: this.state.name}); */
      navigation.navigate('App');
    } catch (error) {
      toastr(error.message, 'danger');
    }
  };
  _renderAccessButton = () => {
    return (
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={() => this.LoginAsync()}
        underlayColor="#325b84">
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <ImageBackground
        style={styles.image}
        source={require('../../assets/logo1.jpg')}>
        <View style={styles.container}>
          <Text style={styles.text}>DevConnector</Text>
          <View style={styles.formGroup}>
            <TextInput
              value={this.state.email}
              onChangeText={this.handleChange('email')}
              placeholder="Email"
              placeholderTextColor="#de7119"
              style={styles.textInput}
              returnKeyType="next"
            />
            <TextInput
              value={this.state.password}
              onChangeText={this.handleChange('password')}
              placeholder="Password"
              placeholderTextColor="#de7119"
              style={styles.textInput}
              secureTextEntry={true}
              returnKeyType="go"
            />
            <View style={styles.btnLogin}>{this._renderAccessButton()}</View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.opacity}>
                Don't have account ? Register now »
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  opacity: {
    color: 'red',
    paddingTop: 18,
    fontSize: 20,
    marginLeft: 98,
  },
  container: {
    flex: 1,
    // backgroundColor: '#d6dce2',
    padding: 10,
  },
  text: {
    color: 'yellow',
    paddingLeft: 209,
    paddingTop: 160,
    fontFamily: 'Century Gothic',
    fontSize: 25,
  },
  textTitle: {
    fontSize: 30,
    color: '#fff',
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
  textRegister: {
    fontSize: 16,
    textAlign: 'center',
    color: '#A0A0A0',
  },
  btnLogin: {
    marginTop: 12,
    paddingTop: 5,
    paddingBottom: 12,
    backgroundColor: '#f4e04d',
    borderRadius: 7,
    borderColor: '#24394d',
  },
  loginText: {
    color: '#d6dce2',
    textAlign: 'center',
    fontSize: 20,
    // color: '#000',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  image: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  user: state.auth,
  email: state.auth.email,
  password: state.auth.password,
  phone: state.auth.phone,
});
export default Login;
