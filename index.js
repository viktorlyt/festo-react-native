import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';

console.disableYellowBox = true;

const App = require('./app/Entrypoint').default;

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
