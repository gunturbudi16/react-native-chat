import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer', 'perform a React']);

import {Root} from 'native-base';

import {store, persistor} from './store';

import {PersistGate} from 'redux-persist/es/integration/react';

import {config} from './configs/firebase';

import firebase from 'firebase';
import Route from './Routes';

const App = () => {
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }, []);
  return (
    <>
      <Root>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Route />
          </PersistGate>
        </Provider>
      </Root>
    </>
  );
};
export default App;
