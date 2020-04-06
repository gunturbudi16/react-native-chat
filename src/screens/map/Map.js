import React, {Component} from 'react';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {StyleSheet, View, Text, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class MapScreen extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  };
  componentDidMount = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Acces Location',
        message: 'This app would like to view your real location.',
        buttonPositive: 'Accept',
      },
    ).then(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const latitudeDelta = 0.00922 * 1.5;
          const longitudeDelta = 0.00421 * 1.5;
          this.setState({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }}
          showsUserLocation={true}>
          <Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title="Marker Me"></Marker>
        </MapView>
      </View>
    );
  }
}
export default MapScreen;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
