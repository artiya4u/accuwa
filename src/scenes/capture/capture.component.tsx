import React, {useEffect, useState} from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import clockSync from 'react-native-clock-sync';
import {Dimensions, ImageStyle, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TopNavigation, TopNavigationAction, Text, IconElement, Icon, Divider} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {Camera} from 'expo-camera';
import {ArrowIosBackIcon} from '../../components/icons';
import moment from 'moment';

const {width} = Dimensions.get('window');
const imageSize = 1024;
const cameraDelayMillis = 300;

export const CaptureScreen = ({navigation, route}): React.ReactElement => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [loading, setLoading] = useState(false);
  const [camera, setCamera] = useState(null);

  const [drift, setDrift] = useState(0);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const [isRatioSet, setIsRatioSet] = useState(false);

  const ShootIcon = (style: ImageStyle): IconElement => (
    <Icon {...style} width={84} height={84} name='radio-button-off-outline' fill='#212b46'/>
  );


  const takePicture = () => {
    if (camera) {
      setLoading(true);
      const options = {quality: 0.88, base64: false, exif: true, skipProcessing: true};
      camera.takePictureAsync(options)
        .then((data) => {
          let subSec = data.exif.SubsecTimeDigitized;
          if (subSec === undefined) {
            subSec = data.exif.SubSecTimeDigitized;
          }
          if (subSec.length > 3) {
            subSec = data.exif.SubSecTime.substring(0, 3);
          }
          const tStamp = moment(data.exif.DateTimeDigitized + '.' + subSec, 'YYYY:MM:DD HH:mm:ss.SSS');
          const timestamp = tStamp.toDate().getTime() - cameraDelayMillis - drift; // Use drift time from NTP
          let imageShortSide = data.width;
          if (data.width > data.height) {
            imageShortSide = data.height; // ignore orientation
          }
          const cropAction = {
            crop: {
              originX: 0,
              originY: imageShortSide / 3 / 2,
              width: imageShortSide,
              height: imageShortSide,
            },
          };
          const resizeAction = {
            resize: {
              width: imageSize,
              height: imageSize,
            },
          };
          ImageManipulator.manipulateAsync(data.uri, [cropAction, resizeAction]).then(value => {
            navigation && navigation.navigate('Dial', {
                watch: route.params.watch,
                imageUri: value.uri,
                timestamp: timestamp,
              },
            );
          });
          setLoading(false);
        });
    }
  };

  const prepareRatio = async () => {
    const desiredRatio = '4:3';
    const remainder = width / 3 / 2;
    setImagePadding(remainder);
    setRatio(desiredRatio);
    setIsRatioSet(true);
  };

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  useEffect(() => {
    (async () => {
      const localTimeBeforeSync = new Date().getTime();
      try {
        const servers = [
          'time.google.com',
          'time.cloudflare.com',
          'time.facebook.com',
        ];
        const clock = new clockSync({
          syncDelay: 5,
          cycleServers: true,
          servers: servers,
        });
        clock.syncTime(function (success) {
          if (success) {
            const localTime = new Date().getTime();
            const syncTime = clock.getTime();
            const timeDrift = localTime - parseInt(syncTime, 10);
            setDrift(timeDrift);
            clock.setOnline(false);
          }
        });
      } catch (e) {
        // Ignore this error in Expo
        console.log(e);
      }
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [navigation]);

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );
  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        title='Capture'
        accessoryLeft={renderBackAction}
      /> <Text>No access to camera</Text>
    </SafeAreaLayout>;
  }
  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        title='Capture'
        accessoryLeft={renderBackAction}
      />
      <Divider/>
      <Camera type={type}
              style={[styles.watchImage, {marginTop: -imagePadding, marginBottom: -imagePadding}]}
              onCameraReady={setCameraReady}
              ratio={ratio}
              ref={(ref) => {
                setCamera(ref);
              }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
        </View>
      </Camera>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={takePicture}
          disabled={loading}>
          <ShootIcon/>
        </TouchableOpacity>
      </View>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
  },
  watchImage: {
    width: width,
    height: width / 3 * 4,
    zIndex: -1,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
