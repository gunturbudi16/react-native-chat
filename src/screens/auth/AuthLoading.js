import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  View,
} from 'react-native';
import User from './User';

const AuthLoading = ({navigation}) => {
  const boosAsync = async () => {
    User.phone = await AsyncStorage.getItem('userToken');
    navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  useEffect(() => {
    boosAsync();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', flex: 1},
});
export default AuthLoading;
