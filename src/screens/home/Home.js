
import React, {Component} from 'react';
import User from '../auth/User';
import {
  SafeAreaView,
  Image,
  Text,
  View,
  Button,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import firebase from 'firebase';

import _ from 'lodash';

class Home extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
    };
  }

  fetchData = async () => {
    this._isMounted = true;
    let uid = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref(`users/`)
      .on('child_added', (snapshot) => {
        if (snapshot.key !== uid) {
          if (this._isMounted) {
            this.setState((prevState) => {
              return {
                users: prevState.users.concat(snapshot.val()),
              };
            });
          }
        }
      });
  };

  componentDidMount = () => {
    this.fetchData();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat', item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderBottomColor: '#99a8b6',
          borderBottomWidth: 0.8,
        }}>
        <Image
          style={{
            width: 36,
            height: 36,
            resizeMode: 'cover',
            borderRadius: 32,
            marginRight: 14,
          }}
          source={
            item.image ? {uri: item.image} : require('../../assets/user.png')
          }
        />
        <View>
          <Text
            style={{
              fontSize: 16,
              color: '#1f3142',
              fontWeight: 'bold',
            }}>
            {item.name} - {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#d6dce2', flex: 1}}>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View
              style={{
                backgroundColor: 'black',
                padding: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'orange',
                  fontWeight: 'bold',
                }}>
                Chats
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}

export default Home;
