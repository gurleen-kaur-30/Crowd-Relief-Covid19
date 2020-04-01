/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// import React from 'react';
// import {View, Text} from 'react-native';

// const App: () => React$Node = () => {
//   return <Text>Step One</Text>;
// };

// export default App;

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import Config from 'react-native-config';

import configureStore from './src/utils/store';
let {store, persistor} = configureStore();

import LinkedRouter from './src/utils/LinkedRouter';
import SplashScreen from './src/components/splashScreen';
import {StyleProvider, Root} from 'native-base';
import getTheme from './src/assets/styles/native-base-theme/components';
import platform from './src/assets/styles/native-base-theme/variables/platform';

import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';

Sentry.init({
  dsn: Config.SENTRY_DSN,
});

/**
 * Navigator using React-Native-Router-Flux
 * @extends Component
 */
class App extends Component {
  componentDidMount() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
    });
    codePush.notifyApplicationReady();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {isLoaded => {
            if (!isLoaded) {
              return <SplashScreen />;
            } else {
              return (
                //Loading custom Native Base styling to the app
                <Root>
                  <StyleProvider style={getTheme(platform)}>
                    <LinkedRouter scheme="https" />
                  </StyleProvider>
                </Root>
              );
            }
          }}
        </PersistGate>
      </Provider>
    );
  }
}

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};
App = codePush(codePushOptions)(App);
export default App;
