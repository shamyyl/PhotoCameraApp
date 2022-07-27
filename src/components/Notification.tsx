import React, {FC, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

interface INotificationProps {
  notification: string;
  setNotification: (v: string) => void;
}

export const Notification: FC<INotificationProps> = ({
  notification,
  setNotification,
}) => {
  const notificationTranslate = useRef(new Animated.Value(50)).current;
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (notification) {
      Animated.timing(notificationTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      setTimeout(() => {
        Animated.timing(notificationTranslate, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }).start();
        Animated.timing(notificationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setTimeout(() => setNotification(''), 300);
      }, 4000);
    }
  }, [
    notification,
    notificationTranslate,
    notificationOpacity,
    setNotification,
  ]);

  return (
    <View style={[styles.notificationContainer, StyleSheet.absoluteFill]}>
      <Animated.View
        style={[
          styles.notification,
          styles.danger,
          {
            transform: [
              {
                translateY: notificationTranslate,
              },
            ],
            opacity: notificationOpacity,
          },
        ]}>
        <Text style={styles.notifcationText}>{notification}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '66%',
  },
  notifcationText: {
    textAlign: 'center',
  },
  danger: {
    backgroundColor: '#EA4545',
  },
});
