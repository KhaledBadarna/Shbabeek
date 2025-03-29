import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_DEe83-gyaV3p2i4CMo0-_kAFhvUMkIU",
  authDomain: "shbabeek-12df9.firebaseapp.com",
  projectId: "shbabeek-12df9",
  storageBucket: "shbabeek-12df9.appspot.com", // ✅ Fixed Storage Bucket
  messagingSenderId: "559597200495",
  appId: "1:559597200495:ios:4dec9997d88ffa944a199a",
};

// ✅ Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const realTimeDb = getDatabase(app);
const messaging = getMessaging(app); // ✅ Add Firebase Messaging

// ✅ Function to Get FCM Token (Ensure it's defined only once)
export async function requestFCMToken() {
  try {
    const token = await getToken(messaging);
    console.log("🔥 FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
}

// ✅ Listen for FCM Messages in Foreground
onMessage(messaging, (payload) => {
  console.log("📲 Foreground Message Received:", payload);
});

// ✅ Ensure `requestFCMToken` is NOT duplicated in the export
export {
  auth,
  firestore,
  realTimeDb,
  messaging,
  doc,
  setDoc,
  getDoc,
  requestFCMToken,
};
