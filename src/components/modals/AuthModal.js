import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { firestore, doc, setDoc } from "../../firebase";

export async function registerForPushNotificationsAsync(userId, userType) {
  if (!Device.isDevice) {
    console.log("❌ Must use a physical device for push notifications");
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Push notification permission not granted");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;
    console.log("📲 Expo Push Token:", expoPushToken);

    const collectionName = userType === "teacher" ? "teachers" : "students";
    const userRef = doc(firestore, collectionName, userId);
    await setDoc(userRef, { pushToken: expoPushToken }, { merge: true });

    console.log("✅ Push token saved to Firestore!");
    return expoPushToken;
  } catch (error) {
    console.error("❌ Error registering for push notifications:", error);
  }
}
