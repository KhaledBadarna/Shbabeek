import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

export async function registerForPushNotificationsAsync() {
  try {
    // Request permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn("❌ Push permission not granted");
      return;
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log("📱 FCM Token:", token);

    // Show notification while app is in foreground
    messaging().onMessage(async (remoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "📬 New Notification",
        body: remoteMessage.notification?.body || "",
        android: {
          channelId: "default",
        },
      });
    });

    return token; // Use this to send via cloud function only
  } catch (err) {
    console.error("🚨 Error registering for push notifications:", err);
  }
}
