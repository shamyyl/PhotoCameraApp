import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';

interface ILoadingBarProps {
  loading: boolean;
}

export const LoadingBar: FC<ILoadingBarProps> = ({loading}) => {
  const [photoUploading, setPhotoUploading] = useState(0);
  const uploadingContainerOpacity = useRef(new Animated.Value(0)).current;
  const uploadingBarTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loading) {
      intervalId = setInterval(() => {
        if (photoUploading > 0 && photoUploading < 95) {
          setPhotoUploading(v => v + 1);
        }
      }, Math.random() * 60);
    }
    return () => clearInterval(intervalId);
  }, [photoUploading, loading]);

  useEffect(() => {
    if (loading) {
      Animated.timing(uploadingBarTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(uploadingContainerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setPhotoUploading(1);
    } else {
      uploadingContainerOpacity.setValue(0);
      uploadingBarTranslateY.setValue(200);
    }
  }, [loading, uploadingContainerOpacity, uploadingBarTranslateY]);

  return (
    <Animated.View
      style={[
        styles.uploadingContainer,
        StyleSheet.absoluteFill,
        // eslint-disable-next-line react-native/no-inline-styles
        {opacity: uploadingContainerOpacity, zIndex: loading ? 2000 : -1},
      ]}>
      <Animated.View
        style={[
          styles.uploadingBar,
          {
            transform: [
              {
                translateY: uploadingBarTranslateY,
              },
            ],
          },
        ]}>
        <Animated.View
          style={[
            styles.uploadingProgress,
            {
              width: `${photoUploading}%`,
            },
          ]}
        />
        <Text>Loading {photoUploading}%</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  uploadingContainer: {
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: 0,
  },
  uploadingBar: {
    position: 'absolute',
    bottom: 0,
    height: 34,
    backgroundColor: 'grey',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingProgress: {
    alignSelf: 'flex-start',
    position: 'absolute',
    backgroundColor: '#4cb461',
    height: 34,
  },
});
