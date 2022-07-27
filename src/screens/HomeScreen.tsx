import React, {useRef, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

import {Camera, PhotoFile, useCameraDevices} from 'react-native-vision-camera';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
// import {S3} from 'aws-sdk';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {Notification} from '../components/Notification';
import {LoadingBar} from '../components/LoadingBar';
import {Snapshot} from '../components/Snapshot';

// const s3 = new S3({
//   accessKeyId: 'LWCBOYGTAM4DM4JAVNRZ',
//   secretAccessKey: '/V/TmMFVgTqqwsxEa4TlZYujF173k1jTimiatUC2VQk',
// });

const REGION = 'eu-west-2';
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: 'DO009DJXPPUEBUEAWCQU',
    secretAccessKey: '/+h+76Z1VvKYdPFsmVWPkHxVnhHtZ0eyxciFzRmJxOY',
  },
});

export const HomeScreen = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [snapshot, setSnapshot] = useState<PhotoFile>();
  const [photo, setPhoto] = useState<PhotoFile>();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // If no device found
  if (device == null) {
    return (
      <>
        <Text>No devices...</Text>
      </>
    );
  }

  const handlePhoto = async () => {
    if (camera.current) {
      const _snapshot = await camera.current.takeSnapshot({
        quality: 85,
        skipMetadata: true,
      });
      setSnapshot(_snapshot);
      camera.current.takePhoto().then(_photo => {
        setPhoto(_photo);
      });
    }
  };

  const cancelPhoto = () => {
    setSnapshot(undefined);
    setPhoto(undefined);
  };

  const savePhoto = async () => {
    setLoading(true);
    setTimeout(async () => {
      if (photo) {
        const file = await fs.readFile(`file://${photo.path}`, 'base64');
        const randomHash = 'testhash';
        try {
          const res = await s3.send(
            new PutObjectCommand({
              Bucket: 'ShamilTest',
              Key: `photo-${randomHash}.jpg`,
              Body: decode(file),
              ContentType: 'image/jpeg',
              ACL: 'public-read',
            }),
          );
          // const res = s3.upload({
          //   Bucket: 'ShamilTest',
          //   Key: `photo-${randomHash}.png`,
          //   Body: file,
          //   ACL: 'public-read',
          // });
          console.log({res});
        } catch (e) {
          console.log({e});
          setNotification('FAILED to upload the image: ' + e);
        }

        setLoading(false);
        setSnapshot(undefined);
        setPhoto(undefined);
      }
    }, 500);
  };

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <Camera
        ref={camera}
        style={[StyleSheet.absoluteFill, snapshot && styles.hidden]}
        device={device}
        isActive={true}
        photo={true}
      />
      {!snapshot && (
        <TouchableOpacity onPress={handlePhoto} style={styles.photoBtn} />
      )}
      <Snapshot
        snapshot={snapshot}
        cancelPhoto={cancelPhoto}
        savePhoto={savePhoto}
      />
      <LoadingBar loading={loading} />
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  container: {
    position: 'relative',
    backgroundColor: 'white',
  },
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
});
