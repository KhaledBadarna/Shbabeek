import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {firestore, doc, setDoc} from '../src/firebase';

export async function registerForPushNotificationsAsync(userId, userType) {
  if (!DeviceInfo.isEmulatorSync()) {
    console.log('❌ Must use a real device for push notifications!');
    return;
  }

  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('❌ Push notifications permission denied!');
      return;
    }

    const token = await messaging().getToken();
    console.log('📲 FCM Token:', token);

    if (!userId || !userType) {
      console.log('❌ Missing userId or userType. Cannot save push token.');
      return;
    }

    const collectionName = userType === 'teacher' ? 'teachers' : 'students';
    const userRef = doc(firestore, collectionName, userId);

    await setDoc(userRef, {pushToken: token}, {merge: true});
    console.log('✅ Push token saved to Firestore!');

    return token;
  } catch (error) {
    console.error('❌ Error registering for push notifications:', error);
  }
}
