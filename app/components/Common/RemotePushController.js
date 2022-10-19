import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { showNotification } from '../services/NotificationHelper';
import PushNotification from 'react-native-push-notification';
import { store } from '@redux/store/configureStore';
import NotificationAction from '@redux/reducers/notification/actions';
import { navigationRef } from 'app/navigation/NavigationService';

const storeFCMToken = async (token) => {
  const {
    notification: { fcmToken },
  } = store.getState();

  try {
    console.log('Saved fcm token', fcmToken);
    if (fcmToken.localeCompare(token) != 0) {
      console.log('FCM Token Has changed');
      await store.dispatch(NotificationAction.setFcmToken(token));
    }
  } catch (error) {}
};

/**
 *firebase notification
 * @function  RemotePushController
 */
const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', JSON.stringify(notification));
        const {
          auth: { activeScreen },
        } = store.getState();
        // old app code
        // dispatch({ type: 'onNotificationOpen', payload: notification });
        store.dispatch(NotificationAction.onNotificationOpen(notification));

        // notification on click
        if (notification.userInteraction && notification.foreground) {
          if (
            notification?.data?.action === 'chat_message' &&
            activeScreen === 'chat'
          ) {
            navigationRef.current.goBack();
          } else if (notification?.data?.action === 'chat_message') {
            navigationRef.current.navigate('Chat');
          } else {
            navigationRef.current.navigate('Notifications');
          }
        }
      },

      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: 'Default channel', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

      const {
        auth: { activeScreen },
      } = store.getState();
      const { data } = remoteMessage.notification;

      if (data?.action === 'chat_message' && activeScreen === 'chat') {
        navigationRef.current.goBack();
      } else if (data?.action === 'chat_message') {
        navigationRef.current.navigate('Chat');
      } else {
        navigationRef.current.navigate('Notifications');
      }
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          if (remoteMessage?.data?.action === 'chat_message') {
            setTimeout(() => {
              navigationRef.current.navigate('Chat');
            }, 3000);
          } else {
            setTimeout(() => {
              navigationRef.current.navigate('Notifications');
            }, 3000);
          }
          // const { route } = remoteMessage.data
          // console.log('Route from Server', route)
          // navigation.navigate(route);
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });

    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        console.log('FCM Token', token);
        return storeFCMToken(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      storeFCMToken(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // dispatch({ type: 'updateNotification', payload: remoteMessage });
      store.dispatch(NotificationAction.updateNotification(remoteMessage));
      showNotification(remoteMessage, true);
    });
    return unsubscribe;
  }, []);
  return null;
};

export default RemotePushController;
