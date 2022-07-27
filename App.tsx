import React, {useEffect, useState} from 'react';
import {Camera} from 'react-native-vision-camera';

import {HomeScreen} from './src/screens/HomeScreen';
import {SplashScreen} from './src/screens/SplashScreen';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      console.log({newCameraPermission});
      setIsAppReady(newCameraPermission === 'authorized');
    })();
  }, []);

  return (
    <>
      <HomeScreen />
      <SplashScreen isAppReady={isAppReady} />
    </>
  );
};

export default App;
