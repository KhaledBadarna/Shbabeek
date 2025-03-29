import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WeeklyDateSelector from "./WeeklyDateSelector";
import MessageModal from "./MessageModal";
import { useSelector } from "react-redux";
import { selectLessons } from "../redux/selectors/lessonsSelectors";
import LessonCallScreen from "../screens/Student/LessonCallScreen";
import { useNavigation } from "@react-navigation/native";
const LessonsCard = () => {
  const lessons = useSelector(selectLessons);
  const loading = useSelector((state) => state.loading || false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lessonMessage, setLessonMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigation = useNavigation();

  // 🔥 Filter lessons for selected date
  const lessonsForDate = useMemo(() => {
    return lessons.filter((lesson) => lesson.selectedDate === selectedDate);
  }, [lessons, selectedDate]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0095ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <WeeklyDateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          availableSlots={lessons}
        />
      </View>

      <View style={styles.flatlistContainer}>
        {lessonsForDate.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 200, marginTop: 15 }}
            data={lessonsForDate}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.lessonContainer}>
                <View style={styles.userImage}>
                  <Image
                    source={{ uri: item.oppositeUser?.profileImage || "" }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.lessonDate}>
                    {item.oppositeUser?.name || "Unknown User"}
                  </Text>
                </View>

                <View style={styles.lessonDetailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.lessonTopic}>{item.selectedTopic}</Text>
                    <Icon
                      style={{ marginLeft: 5 }}
                      name="bookshelf"
                      size={20}
                      color="#031417"
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.lessonDate}>
                      {item.startTime} - {item.endTime}
                    </Text>
                    <Icon
                      name="clock-time-ten-outline"
                      size={20}
                      color="#031417"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.enterLessonButton}
                    onPress={() =>
                      navigation.navigate("LessonCallScreen", {
                        roomName: item.id, // or any unique ID for the lesson
                        userName: item.oppositeUser?.name,
                      })
                    }
                  >
                    <Text style={styles.enterLessonButtonText}>دخول الدرس</Text>
                  </TouchableOpacity>

                  <MessageModal
                    onClose={() => setModalVisible(false)}
                    lessonMessage={lessonMessage}
                    modalVisible={modalVisible}
                  />
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noLessonsText}>
            لا يوجد مواعيد متاحة لهذا اليوم
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  flatlistContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  lessonContainer: {
    position: "relative",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  userImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 65,
    height: 65,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#e1e1e1",
  },
  lessonDate: {
    fontSize: 14,
    color: "#031417",
    fontFamily: "Cairo",
    marginRight: 5,
  },
  lessonTopic: {
    fontSize: 14,
    color: "#031417",
    fontFamily: "Cairo",
  },
  lessonDetailsContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderRightWidth: 3.5,
    paddingHorizontal: 20,
    borderColor: "#00e5ff",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  enterLessonButton: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    width: "100%",
    shadowColor: "#031417",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "#fff",
  },
  enterLessonButtonText: {
    color: "#031417",
    fontSize: 13,
    fontFamily: "Cairo",
  },
  noLessonsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    fontFamily: "Cairo",
  },
  msgButton: {
    position: "absolute",
    bottom: 130,
    left: 5,
  },
});

export default LessonsCard;
