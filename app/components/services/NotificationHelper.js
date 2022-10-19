import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import moment from 'moment';
import { isNull } from 'lodash';
import { store } from '@redux/store/configureStore';

/**
 *
 *@function showNotification
 *
 */
export const showNotification = (remoteMessage, isForeground = false) => {
  const {
    auth: { activeScreen, activeChatUser },
  } = store.getState();
  console.log('Show Notification Called', remoteMessage);
  const { data, notification, sentTime } = remoteMessage;
  // sendLocalNotification(data.title, data.message);
  if (
    !remoteMessage.hasOwnProperty('notification') /*notification === undefined*/
  ) {
    // For Handling Comet Chat Notifications
    console.log('No Notification key present');
    const { title, alert, message } = data;
    let notificationTitle = title;
    console.log('title>>>', title);
    console.log('alert>>>', alert);
    console.log('message>>>', message ? JSON.stringify(message) : '');
    if (message) {
      if (
        activeScreen === 'chat' &&
        data?.action === 'chat_message' &&
        Number(activeChatUser) !== Number(data?.sender_id) &&
        !isNull(activeChatUser)
      ) {
        sendLocalNotification(notificationTitle, alert, message);
      } else if (
        (activeScreen === 'chat' && data?.action === 'chat_message') ||
        (activeScreen === 'notification' && data?.action !== 'chat_message')
      ) {
        console.log('not showing notification');
      } else {
        sendLocalNotification(notificationTitle, alert, message);
      }
    }
  } else {
    console.log('Notification key present');
    // if (isForeground) {
    //Receiving Notification from our server in foreground
    const { body, title } = notification;
    if (
      activeScreen === 'chat' &&
      data?.action === 'chat_message' &&
      Number(activeChatUser) !== Number(data?.sender_id) &&
      !isNull(activeChatUser)
    ) {
      sendLocalNotification(title, body, data, sentTime);
    } else if (
      (activeScreen === 'chat' && data?.action === 'chat_message') ||
      (activeScreen === 'notification' && data?.action !== 'chat_message')
    ) {
      console.log('not showing notification');
    } else {
      sendLocalNotification(title, body, data, sentTime);
    }
    // }
  }
};

const sendLocalNotification = (title, body, data, time) => {
  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_launcher_round', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      title: title,
      message: body,
      bigPictureUrl: data?.imageUrl || '',
      when: time || moment().unix(),
      userInfo: data,
      // tag: tag,
    });
  } else {
    let details = {
      alertTitle: title,
      alertBody: body,
      userInfo: data,
    };

    console.log('PushNotificationIOS ===', PushNotificationIOS);
    PushNotificationIOS.presentLocalNotification(details);
  }
};
