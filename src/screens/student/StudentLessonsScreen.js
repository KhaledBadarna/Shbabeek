import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import WeeklyDateSelector from "../../components/WeeklyDateSelector";
import useFetchLessons from "../../redux/utils/useFetchLessons"; // Assuming this hook is working
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MessageModal from "../../components/MessageModal";

const StudentLessonsScreen = () => {
  const [selectedDay, setSelectedDay] = useState(""); // Selected day
  const [groupedLessons, setGroupedLessons] = useState([]); // Grouped lessons by day
  const [modalVisible, setModalVisible] = useState(false); // Default tab is "pending"
  const [lessonMessage, setLessonMessage] = useState(""); // Store message for the modal

  // Fetch lessons using the useFetchLessons hook
  const { lessons, loading, error, userDetails } = useFetchLessons(); // Assuming this hook returns lessons, loading, and error
  const closeModal = () => {
    setModalVisible(false);
  };
  // Handle selecting a day
  const handleSelectDay = (dayName, date) => {
    setSelectedDay(dayName);
  };

  // Group lessons by day
  const groupLessonsByDay = (lessons) => {
    return lessons.reduce((acc, lesson) => {
      if (!lesson.day) return acc; // Skip if there's no day
      if (!acc[lesson.day]) {
        acc[lesson.day] = [];
      }
      acc[lesson.day].push(lesson);
      return acc;
    }, {});
  };

  // Sort lessons by start time
  const sortLessonsByTime = (lessons) => {
    return lessons.sort((a, b) => {
      const aTime = a.startTime.split(":");
      const bTime = b.startTime.split(":");
      return (
        parseInt(aTime[0]) * 60 +
        parseInt(aTime[1]) -
        (parseInt(bTime[0]) * 60 + parseInt(bTime[1]))
      );
    });
  };

  // Update grouped lessons when fetched data changes
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const grouped = groupLessonsByDay(lessons);
      setGroupedLessons(grouped);
    }
  }, [lessons]); // Re-run when lessons are fetched

  // Handle "دخول الدرس" button
  const handleEnterLesson = (startTime) => {
    const currentTime = new Date();
    const [lessonHour, lessonMinute] = startTime.split(":").map(Number);
    const lessonTime = new Date();
    lessonTime.setHours(lessonHour, lessonMinute);

    const timeDifference = lessonTime - currentTime;

    if (timeDifference > 600000) {
      // 10 minutes before lesson start (600000 ms)
      Alert.alert("تنبيه", "لا يمكنك دخول الدرس إلا قبل 10 دقائق من بدءه");
    } else {
      // Proceed to the lesson
      console.log("Entering the lesson now...");
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading lessons!</Text>;

  return (
    <View style={styles.container}>
      {/* WeeklyDateSelector to select the day */}
      <View style={styles.tabsContainer}>
        <WeeklyDateSelector
          onSelectDay={handleSelectDay}
          availableSlots={lessons} // Passing lessons to WeeklyDateSelector for better interaction
        />
      </View>

      {/* List of lessons grouped by day */}
      <View style={styles.flatlistContainer}>
        {groupedLessons[selectedDay] &&
        groupedLessons[selectedDay].length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 200 }} // Add some padding at the bottom
            data={sortLessonsByTime(groupedLessons[selectedDay])} // Sort lessons by start time
            renderItem={({ item }) => {
              return (
                <View style={styles.lessonContainer}>
                  <View style={styles.userImage}>
                    <Image
                      source={{ uri: userDetails.profileImage }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.lessonDate}>{userDetails.name}</Text>
                  </View>
                  <View style={styles.lessonDetailsContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.lessonTopic}>{item.topicName}</Text>
                      <Icon
                        style={{ marginLeft: 5 }}
                        name="bookshelf"
                        size={20}
                        color="#333"
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.lessonDate}>
                        {item.startTime} - {item.endTime}
                      </Text>
                      <Icon
                        name="clock-time-ten-outline"
                        size={20}
                        color="#333"
                      />
                    </View>

                    {/* Add button to enter lesson */}
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.enterLessonButton}
                        onPress={() => handleEnterLesson(item.startTime)}
                      >
                        <Text style={styles.enterLessonButtonText}>
                          دخول الدرس
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.enterLessonButton}
                        onPress={() => {
                          setLessonMessage(item.message);
                          setModalVisible(true);
                        }}
                      >
                        <Icon
                          name="message-reply-text-outline"
                          size={25}
                          color="#333"
                        />
                      </TouchableOpacity>
                    </View>
                    <MessageModal
                      onClose={closeModal}
                      lessonMessage={lessonMessage} // Pass the message to the modal
                      modalVisible={modalVisible}
                    />
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.id} // Ensure each item has a unique ID
            showsVerticalScrollIndicator={false} // Hide vertical scrollbar
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
  },
  tabsContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  msg: { marginRight: 20 },
  flatlistContainer: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  lessonContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  lessonTopic: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Cairo",
    fontWeight: "bold",
  },
  lessonDate: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Cairo",
    marginRight: 5,
    fontWeight: "bold",
  },
  noLessonsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    fontFamily: "Cairo",
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 40,
  },
  userImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  lessonDetailsContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderRightWidth: 3.5,
    paddingHorizontal: 20,
    borderColor: "#00adf0",
  },
  enterLessonButton: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 7,
    borderWidth: 1.5,
    borderColor: "#939393",
    marginLeft: 8,
  },
  enterLessonButtonText: {
    color: "#333",
    fontSize: 10,
    fontFamily: "Cairo",
    fontWeight: "bold",
  },
});

export default StudentLessonsScreen;
