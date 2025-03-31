import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

import { firestore, doc, setDoc } from "../../firebase";

export async function registerForPushNotificationsAsync(userId, userType) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log("❌ Push permission not granted");
    return;
  }

  const token = await messaging().getToken();
  console.log("📲 FCM token:", token);

  const collectionName = userType === "teacher" ? "teachers" : "students";
  const userRef = doc(firestore, collectionName, userId);
  await setDoc(userRef, { pushToken: token }, { merge: true });

  console.log("✅ Push token saved to Firestore!");

  // Optional: display test notification
  await notifee.displayNotification({
    title: "🎉 Notifications ready!",
    body: "Push notifications have been configured.",
    android: {
      channelId: await notifee.createChannel({
        id: "default",
        name: "Default Channel",
      }),
    },
  });

  return token;
}
