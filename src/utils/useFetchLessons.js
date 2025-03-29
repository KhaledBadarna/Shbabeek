import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLessons } from "../slices/lessonSlice";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";

const useFetchLessons = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const userRole = useSelector((state) => state.user.userType);

  useEffect(() => {
    if (!userId) return;

    const fetchLessons = async () => {
      try {
        const bookingDocRef = doc(firestore, "bookings", userId);
        const bookingDocSnapshot = await getDoc(bookingDocRef);

        if (!bookingDocSnapshot.exists()) {
          console.warn("⚠️ No booking document found for user");
          dispatch(setLessons([]));
          return;
        }

        const { lessonIds } = bookingDocSnapshot.data() || {};
        if (!lessonIds || lessonIds.length === 0) {
          console.warn("⚠️ No lessons booked for user");
          dispatch(setLessons([]));
          return;
        }

        const lessonsCollectionRef = collection(firestore, "lessons");
        const querySnapshot = await getDocs(lessonsCollectionRef);
        const fetchedLessons = [];

        querySnapshot.forEach((doc) => {
          if (lessonIds.includes(doc.id)) {
            fetchedLessons.push({ id: doc.id, ...doc.data() });
          }
        });

        const updatedLessons = fetchedLessons.filter(
          (lesson) => lesson.isComplete === false
        );

        dispatch(setLessons(updatedLessons)); // ✅ Store in Redux
      } catch (error) {
        console.error("❌ Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, [userId, userRole, dispatch]);
};

export default useFetchLessons;
