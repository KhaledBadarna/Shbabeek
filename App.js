import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider } from "react-redux";
import store from "./src/redux/store";
import BottomTabNavigator from "./src/components/BottomTabNavigator";
import TeacherInfoScreen from "./src/screens/teacher/TeacherInfoScreen";
import TopicTeachersScreen from "./src/screens/student/TopicTeachersScreen";
// import TeacherRegisterScreen from './src/screens/teacher/TeacherRegisterScreen';
import AuthModal from "./src/components/modals/AuthModal";
import EditBioScreen from "./src/screens/teacher/EditBioScreen";
import BookingScreen from "./src/screens/student/BookingScreen";
import TeacherBookingScreen from "./src/screens/teacher/TeacherBookingScreen";
import BankDetailsScreen from "./src/screens/teacher/BankDetailsScreen";
import TeacherSettingsScreen from "./src/screens/teacher/TeacherSettingsScreen";
import ProfitsScreen from "./src/screens/teacher/ProfitsScreen";
import LessonCallScreen from "./src/screens/shared/LessonCallScreen";

//#DF3F5E
const Stack = createStackNavigator();
import ChatScreen from "./src/screens/shared/ChatScreen";
// Linking configuration to handle deep linking
const linking = {
  prefixes: ["shbabeek://"], // Use your app's scheme here
  config: {
    screens: {
      "صفحة المعلم": "teacher/:teacherId", // Deep link structure in Arabic
    },
  },
};

export default function App() {
  // UseEffect hook to handle push notifications registration

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#ffffff", // Set background color to white
            },
            headerTintColor: "#0a0a0a", // Set text color
            headerTitleStyle: {
              fontFamily: "Cairo", // Apply Cairo font
              fontSize: 15,
            },
            headerBackTitleVisible: false, // Hide back button text
          }}
        >
          <Stack.Screen
            name="Home"
            options={{ headerShown: false, title: "الرئيسية" }}
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name="TopicTeachersScreen"
            component={TopicTeachersScreen}
            options={({ route }) => ({
              title: `معلمي ${route.params?.topic.name || ""}`,
            })}
          />
          <Stack.Screen
            name="صفحة المعلم"
            component={TeacherInfoScreen}
            options={{ title: "صفحة المعلم" }}
          />
          {/* <Stack.Screen
            name="TeacherRegisterScreen"
            component={TeacherRegisterScreen}
            options={{title: 'المعلم'}}
          /> */}
          {/* Modal */}
          <Stack.Screen
            name="AuthModal"
            component={AuthModal}
            options={{ headerShown: false }} // Hide the header for modal
          />
          <Stack.Screen
            name="EditBioScreen"
            component={EditBioScreen}
            options={{
              title: "تعديل النبذة",
              headerBackTitle: "رجوع", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="BankDetailsScreen"
            component={BankDetailsScreen}
            options={{
              title: "الحساب البنكي",
              headerBackTitle: "رجوع", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{
              title: "حجز درس",
              headerBackTitle: "رجوع", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="TeacherBookingScreen"
            component={TeacherBookingScreen}
            options={{
              title: "حجز درس",
              headerBackTitle: "رجوع", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              title: "الرسائل",
              headerBackTitle: "رجوع", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="TeacherSettingsScreen"
            component={TeacherSettingsScreen}
            options={{
              title: "ملف المعلم",
              headerBackTitle: "صفحتي", // Customize the back button text
            }}
          />
          <Stack.Screen
            name="ProfitsScreen"
            component={ProfitsScreen}
            options={{
              title: "ارباحي",
              headerBackTitle: "صفحتي", // Customize the back button text
            }}
          />

          <Stack.Screen
            name="LessonCallScreen"
            component={LessonCallScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
