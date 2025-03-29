import React from 'react';
import {TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShareTeacherButton = ({teacherId}) => {
  const teacherProfileUrl = `https://shbabeek.com/teacher/${teacherId}`; // Web fallback

  const handleShare = async () => {
    try {
      const options = {
        message: 'Check out this teacher on Shbabeek!',
        url: teacherProfileUrl,
      };
      await Share.open(options);
    } catch (error) {
      if (error && error.message !== 'User did not share') {
        console.error('Error sharing:', error.message);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Icon
        name="share-variant-outline"
        size={25}
        color="#031417"
        style={{marginRight: 10}}
      />
    </TouchableOpacity>
  );
};

export default ShareTeacherButton;
