import React, {FC, useEffect, useRef} from 'react';
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {PhotoFile} from 'react-native-vision-camera';

interface ISnapshotProps {
  snapshot?: PhotoFile;
  cancelPhoto: () => void;
  savePhoto: () => void;
}

export const Snapshot: FC<ISnapshotProps> = ({
  snapshot,
  cancelPhoto,
  savePhoto,
}) => {
  const transformAnimation = useRef(new Animated.Value(200)).current;
  useEffect(() => {
    if (snapshot) {
      Animated.timing(transformAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      transformAnimation.setValue(200);
    }
  }, [snapshot, transformAnimation]);

  if (!snapshot) {
    return null;
  }

  return (
    <>
      <ImageBackground
        source={{
          uri: `file://${snapshot.path}`,
        }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.btnContainer,
          {
            transform: [
              {
                translateY: transformAnimation,
              },
            ],
          },
        ]}>
        <TouchableOpacity
          onPress={cancelPhoto}
          style={[styles.actionBtn, styles.cancelBtn]}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={savePhoto}
          style={[styles.actionBtn, styles.saveBtn]}>
          <Text style={styles.btnText}>Save Photo</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  photoBtn: {
    zIndex: 200,
    position: 'absolute',
    bottom: '8%',
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#f7f7f7',
    borderWidth: 2,
    borderColor: 'grey',
  },
  btnContainer: {
    position: 'absolute',
    bottom: '8%',
    width: '100%',
    justifyContent: 'center',
    zIndex: 200,
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 20,
    shadowColor: 'black',
  },
  cancelBtn: {
    backgroundColor: 'grey',
    marginRight: 20,
  },
  saveBtn: {
    backgroundColor: '#4cb461',
  },
  btnText: {
    fontSize: 14,
    color: '#f7f7f7',
    lineHeight: 22,
    minWidth: 90,
    textAlign: 'center',
  },
});
