import AsyncStorage from '@react-native-community/async-storage';
import {Toast} from 'native-base';
const toastr = (message, type) => {
  Toast.show({
    text: message,
    buttonText: 'Okay',
    type,
  });
};

const getDataStorage = async (item, callback) => {
  try {
    const value = await AsyncStorage.getItem(item);
    callback(value);
  } catch (err) {
    callback(null);
  }
};

export {toastr, getDataStorage};
