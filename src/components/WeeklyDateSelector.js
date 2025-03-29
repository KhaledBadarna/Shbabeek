import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Arabic days
const daysOfWeek = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const WeeklyDateSelector = ({
  selectedDate,
  onSelectDate,
  availableSlots = [],
}) => {
  const [dates, setDates] = useState([]);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      today.setDate(today.getDate() + 1);

      const next7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
          label: daysOfWeek[date.getDay()],
          dateStr: date.toISOString().split("T")[0],
          dayNumber: date.getDate(),
        };
      });

      setDates(next7Days);

      const firstAvailable = next7Days.find((d) => {
        const dayName = daysOfWeek[new Date(d.dateStr).getDay()];
        return availableSlots?.some(
          (slot) => slot.date === d.dateStr || slot.day === dayName
        );
      });

      const defaultDate = firstAvailable?.dateStr || next7Days[0].dateStr;
      onSelectDate(defaultDate); // ✅ Always update on focus
    }, [availableSlots, onSelectDate])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.monthYearText}>
        {dates[0] &&
          new Date(dates[0].dateStr).toLocaleDateString("ar-EG", {
            month: "long",
            year: "numeric",
          })}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}
      >
        {dates.map(({ label, dateStr, dayNumber }, index) => {
          const isSelected = selectedDate === dateStr;
          const hasSlots = availableSlots?.some(
            (slot) => slot.date === dateStr || slot.day === label
          );

          return (
            <TouchableOpacity
              key={index}
              style={styles.dayButton}
              onPress={() => onSelectDate(dateStr)}
            >
              <Text style={[styles.dayName, !hasSlots && styles.greyDayText]}>
                {label}
              </Text>
              <View
                style={[
                  styles.dayNumberContainer,
                  isSelected && styles.selectedDayNumber,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && { color: "#fff" },
                    !hasSlots && styles.greyDayText,
                  ]}
                >
                  {dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Cairo",
    color: "#031417",
    marginBottom: 8,
  },
  scrollViewContent: {
    flexDirection: "row-reverse",
  },
  dayButton: {
    padding: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  dayName: {
    fontSize: 14,
    fontFamily: "Cairo",
    color: "#031417",
  },
  greyDayText: {
    color: "#bcbcbc",
  },
  dayNumberContainer: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginTop: 3,
  },
  selectedDayNumber: {
    backgroundColor: "#00e5ff",
  },
  dayNumber: {
    fontSize: 15,
    fontFamily: "Cairo",
    color: "#031417",
  },
});

export default WeeklyDateSelector;
