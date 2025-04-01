import { onDocumentCreated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

admin.initializeApp();

export const sendPushNotification = onDocumentCreated(
  "lessons/{lessonId}",
  async (event) => {
    const data = event.data.data();
    const teacherId = data.teacherId;

    const teacherDoc = await admin
      .firestore()
      .collection("teachers")
      .doc(teacherId)
      .get();
    const pushToken = teacherDoc.data()?.pushToken;

    if (!pushToken) return console.log("❌ No token for teacher");

    const message = {
      token: pushToken,
      notification: {
        title: "📚 Lesson Booked",
        body: "You've got a new lesson!",
      },
    };

    await admin.messaging().send(message);
    console.log("✅ Push sent!");
  }
);

export const sendChatNotification = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data.data();
    const chatId = event.params.chatId;
    const [teacherId, studentId] = chatId.split("_");
    const senderId = messageData.senderId;
    const recipientId = senderId === teacherId ? studentId : teacherId;

    let userDoc = await admin
      .firestore()
      .collection("teachers")
      .doc(recipientId)
      .get();
    if (!userDoc.exists) {
      userDoc = await admin
        .firestore()
        .collection("students")
        .doc(recipientId)
        .get();
    }

    const pushToken = userDoc.data()?.pushToken;
    if (!pushToken) return console.log("❌ No token for user");

    const message = {
      token: pushToken,
      notification: {
        title: "💬 New Chat Message",
        body: messageData.text || "You have a new message",
      },
    };

    await admin.messaging().send(message);
    console.log("✅ Chat push sent!");
  }
);
