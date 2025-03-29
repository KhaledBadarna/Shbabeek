import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { firestore, doc, setDoc } from "../src/firebase";

export async function registerForPushNotificationsAsync(userId, userType) {
  if (!Device.isDevice) {
    console.log("❌ Must use a real device for push notifications!");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Push notifications permission denied!");
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  console.log("📲 Expo push token:", token);

  if (!userId || !userType) {
    console.log("❌ Missing userId or userType. Cannot save push token.");
    return;
  }

  const collectionName = userType === "teacher" ? "teachers" : "students";
  const userRef = doc(firestore, collectionName, userId);

  await setDoc(userRef, { pushToken: token }, { merge: true });
  console.log("✅ Push token saved to Firestore!");

  return token;
}
