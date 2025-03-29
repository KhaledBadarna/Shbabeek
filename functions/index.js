import { onDocumentCreated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

// ✅ Initialize Firebase Admin
admin.initializeApp();

/**
 * ✅ SEND NOTIFICATION WHEN A LESSON IS BOOKED
 */
export const sendPushNotification = onDocumentCreated(
  "lessons/{lessonId}",
  async (event) => {
    const lessonData = event.data.data();
    const teacherId = lessonData.teacherId;

    try {
      const teacherDoc = await admin
        .firestore()
        .collection("teachers")
        .doc(teacherId)
        .get();
      const pushToken = teacherDoc.data()?.pushToken;

      if (pushToken) {
        const messagePayload = {
          to: pushToken,
          sound: "default",
          title: "New Lesson Booked",
          body: "You have a new lesson booked by a student",
        };

        // ✅ Send push notification using Expo
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });

        console.log("✅ Lesson booking notification sent successfully");
      } else {
        console.log("⚠️ Teacher doesn't have a push token");
      }
    } catch (error) {
      console.error("❌ Error sending push notification:", error);
    }
  }
);

/**
 * ✅ SEND NOTIFICATION WHEN A NEW CHAT MESSAGE IS SENT
 */
export const sendChatNotification = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data.data();
    const chatId = event.params.chatId;
    const senderId = messageData.senderId;
    const messageText = messageData.text || "You have a new message!";

    console.log("📩 New message received in chat:", chatId);

    // ✅ Extract teacherId and studentId
    const [teacherId, studentId] = chatId.split("_");

    // ✅ Determine recipient (opposite of sender)
    const recipientId = senderId === teacherId ? studentId : teacherId;

    try {
      // ✅ Get the chat document to fetch sender details
      const chatDoc = await admin
        .firestore()
        .collection("chats")
        .doc(chatId)
        .get();

      if (!chatDoc.exists) {
        console.log(`❌ Chat document not found for chatId: ${chatId}`);
        return;
      }

      const users = chatDoc.data()?.users;

      if (!users || !users[senderId]) {
        console.log(
          `❌ Sender data not found in chat users for senderId: ${senderId}`
        );
        return;
      }

      // ✅ Get sender name and profile image
      const senderName = users[senderId]?.name || "Someone";
      const senderProfileImage = users[senderId]?.profileImage || "";

      // ✅ Retrieve recipient's push token
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

      if (!userDoc.exists) {
        console.log(`❌ No user found with ID: ${recipientId}`);
        return;
      }

      const pushToken = userDoc.data()?.pushToken;

      if (pushToken) {
        const messagePayload = {
          to: pushToken,
          sound: "default",
          title: `رسالة جديده من ${senderName}`,
          body: messageText,
          data: {
            senderName,
            senderProfileImage, // ✅ Send profile image as extra data
            messageText,
            chatId,
          },
        };

        // ✅ Send push notification
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });

        console.log(
          "✅ Chat push notification sent successfully!",
          await response.json()
        );
      } else {
        console.log("⚠️ No push token found for recipient:", recipientId);
      }
    } catch (error) {
      console.error("❌ Error sending chat push notification:", error);
    }
  }
);
