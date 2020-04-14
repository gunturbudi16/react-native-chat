import React, {Component} from 'react';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
class MapScreen extends Component {
  state = {
    tracksViewChanges: true,
    userData: [],
    isVisible: false,
    uid: '',
    friendName: '',
    friendDob: '',
    friendGender: '',

    userUID: '',

    friendLatitude: '',
    friendLongitude: '',
  };
  getAllUser = async () => {
    const ref = firebase.database().ref('/users');
    ref.on('value', async (snapshot) => {
      let data = [];
      await Object.keys(snapshot.val()).map((key) => {
        data.push({
          uid: key,
          data: snapshot.val()[key],
        });
      });
      await this.setState({
        userData: data,
      });
    });
  };
  getUser = async () => {
    const uid = firebase.auth().currentUser.uid;
    this.setState({
      userUID: uid,
    });
  };
  handleProfile = async (uid) => {
    this.setState({
      isVisible: !this.state.isVisible,
      uid,
    });
    const ref = firebase.database().ref(`users/${uid}`);
    await ref.on('value', (snapshot) => {
      this.setState({
        friendName: snapshot.val().name,
        friendDob: snapshot.val().status,
        friendGender: snapshot.val().bio,
      });
    });
  };

  stopTrackingViewChanges = () => {
    this.setState(() => ({
      tracksViewChanges: false,
    }));
  };
  componentDidMount() {
    this.getUser();
    this.getAllUser();
  }
  render() {
    const {tracksViewChanges} = this.state;
    return (
      <>
        <MapView
          onPress={() => this.setState({isVisible: false})}
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          initialRegion={{
            latitude: -7.7584874,
            longitude: 110.3781121,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {this.state.userData.map((data) => {
            {
            }
            return (
              <Marker
                onPress={() => this.handleProfile(data.data.uid)}
                coordinate={{
                  latitude: Number(data.data.latitude),
                  longitude: Number(data.data.longitude),
                }}
                title={data.data.name}
                description={data.data.status}
                key={data.data.uid}>
                <View style={styles.marker}>
                  <Image
                    source={require('../../assets/user.png')}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      borderColor: 'white',
                      borderWidth: 1,
                    }}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      </>
    );
  }
}
export default MapScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 5,
    borderRadius: 20,
    elevation: 10,
  },
});
