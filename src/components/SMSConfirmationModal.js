// import React, { useState, useRef } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useDispatch } from "react-redux";
// import { setUserInfo } from "../redux/slices/userSlice";
// import { firestore } from "../firebase";
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
// import { registerForPushNotificationsAsync } from "../redux/utils/pushNotification";

// const SMSConfirmationModal = ({ visible, onClose, phone, role }) => {
//   const dispatch = useDispatch();
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const inputs = useRef([]);

//   const handleChange = (text, index) => {
//     if (text.length > 1) text = text.slice(0, 1);
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 3) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const handleBackspace = (key, index) => {
//     if (key === "Backspace" && !otp[index] && index > 0) {
//       inputs.current[index - 1].focus();
//     }
//   };

//   const confirmOtp = async () => {
//     const code = otp.join("");

//     if (code.length !== 4) {
//       alert("يرجى إدخال رمز التحقق المكون من 4 أرقام"); // Prevent empty OTP submission
//       return;
//     }

//     console.log("Verifying OTP for:", phone, "Role:", role);

//     try {
//       // ✅ Replace this with actual OTP verification logic
//       const isOtpValid = await verifyOtpWithServer(phone, code);
//       if (!isOtpValid) {
//         alert("رمز التحقق غير صحيح، حاول مرة أخرى");
//         return;
//       }

//       // ✅ Proceed only if OTP is correct
//       const usersCollectionRef = collection(
//         firestore,
//         role === "student" ? "students" : "teachers"
//       );
//       const q = query(usersCollectionRef, where("phone", "==", phone));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         const existingUser = querySnapshot.docs[0].data();
//         dispatch(
//           setUserInfo({
//             ...existingUser,
//             userId: querySnapshot.docs[0].id,
//             isLoggedIn: true, // ✅ Now we set isLoggedIn only after correct OTP
//           })
//         );
//       } else {
//         const userData = {
//           phone,
//           userType: role,
//           profileImage: "",
//           isLoggedIn: true, // ✅ Now we set isLoggedIn only after correct OTP
//           favorites: [],
//         };
//         const docRef = await addDoc(usersCollectionRef, userData);
//         dispatch(setUserInfo({ ...userData, userId: docRef.id }));
//       }

//       await registerForPushNotificationsAsync();
//       onClose(); // Close OTP modal after successful registration
//     } catch (error) {
//       console.error("Error registering user:", error);
//     }
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={() => {
//         setOtp(["", "", "", ""]); // ✅ Clear OTP input on close
//         onClose();
//       }}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContent}>
//           {/* Close Button */}
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => {
//               setOtp(["", "", "", ""]); // ✅ Clear OTP when modal closes
//               dispatch(setUserInfo({ phone: "", userType: "student" }));
//               onClose();
//             }}
//           >
//             <Text style={styles.closeText}>×</Text>
//           </TouchableOpacity>

//           <Icon name="chatbox-ellipses-outline" size={50} color="#00adf0" />
//           <Text style={styles.title}>تأكيد رقم الهاتف</Text>
//           <Text style={styles.subtitle}>
//             أدخل رمز التحقق المرسل إلى {phone}
//           </Text>

//           {/* OTP Input Fields */}
//           <View style={styles.otpContainer}>
//             {otp.map((digit, index) => (
//               <TextInput
//                 key={index}
//                 ref={(el) => (inputs.current[index] = el)}
//                 style={styles.otpInput}
//                 keyboardType="number-pad"
//                 maxLength={1}
//                 value={digit}
//                 onChangeText={(text) => handleChange(text, index)}
//                 onKeyPress={({ nativeEvent }) =>
//                   handleBackspace(nativeEvent.key, index)
//                 }
//               />
//             ))}
//           </View>

//           {/* Confirm Button */}
//           <TouchableOpacity style={styles.confirmButton} onPress={confirmOtp}>
//             <Text style={styles.confirmButtonText}>تأكيد</Text>
//           </TouchableOpacity>

//           {/* Resend OTP */}
//           <TouchableOpacity
//             style={styles.resendButton}
//             onPress={() => console.log("Resending OTP...")}
//           >
//             <Text style={styles.resendText}>إعادة إرسال الرمز</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     position: "relative",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#ede9e9",
//     borderRadius: 20,
//     width: 30,
//     height: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   closeText: {
//     fontSize: 20,
//     color: "#00adf0",
//     fontWeight: "bold",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginVertical: 10,
//     fontFamily: "Cairo",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#777",
//     fontFamily: "Cairo",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   otpContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   otpInput: {
//     width: 50,
//     height: 50,
//     marginHorizontal: 5,
//     borderWidth: 2,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     fontSize: 22,
//     textAlign: "center",
//     fontFamily: "Cairo",
//     color: "#333",
//   },
//   confirmButton: {
//     backgroundColor: "#00adf0",
//     paddingVertical: 12,
//     paddingHorizontal: 50,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   confirmButtonText: {
//     fontSize: 18,
//     color: "#fff",
//     fontFamily: "Cairo",
//   },
//   resendButton: {
//     marginTop: 15,
//   },
//   resendText: {
//     fontSize: 14,
//     color: "#00adf0",
//     fontFamily: "Cairo",
//   },
// });

// export default SMSConfirmationModal;
