import React from 'react';

import {
  SafeAreaView,
  Image,
  Text,
  View,
  StyleSheet,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import firebase from 'firebase';
import _ from 'lodash';

class Home extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }
  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };
  async _fetchdata() {
    this._isMounted = true;
    const uid = await AsyncStorage.getItem('userToken');
    firebase
      .database()
      .ref(`user_conversation/${uid}`)
      .on('child_added', snapshot => {
        if (snapshot.key !== uid) {
          if (this._isMounted) {
            this.setState(prevState => {
              return {
                users: prevState.users.concat(snapshot.val()),
              };
            });
          }
        }
      });
  }
  componentDidMount() {
    this._fetchdata();
  }
  componentWillMount() {
    this._isMounted = false;
  }
  renderRow = ({item}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Chat', item)}
          style={styles.chat}>
          <Image
            style={styles.image}
            source={
              item.image ? {uri: item.image} : require('../../assets/user.png')
            }
          />
          <View>
            <Text style={styles.name}>
              {item.name} - {item.lastMessage}{' '}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.view}>
          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.uid}
            ListHeaderComponent={() => (
              <View style={styles.flatlist}>
                <Text style={styles.chats}> Chats </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  view: {backgroundColor: '#d6dce2', flex: 1},
  flatlist: {
    backgroundColor: '#34526e',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 36,
    height: 36,
    resizeMode: 'cover',
    borderRadius: 32,
    marginRight: 14,
  },
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#99a8b6',
    borderBottomWidth: 0.8,
  },
  name: {
    fontSize: 16,
    color: '#1f3142',
    fontWeight: 'bold',
  },
  chats: {
    fontSize: 20,
    color: '#eaedf0',
    fontWeight: 'bold',
  },
});
export default Home;
