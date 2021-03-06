import React, {useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import {TopNavigation, TopNavigationAction, Text, Layout, Divider, Icon, Button} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon} from '../../components/icons';
import PhotoView from 'react-native-photo-view-ex';

const {width} = Dimensions.get('window');

export const DialScreen = ({navigation, route}): React.ReactElement => {

  const [timestampOfPhoto, setTimestampOfPhoto] = useState(route.params.timestamp);
  const [timestampOnTheDial, setTimestampOnTheDial] = useState(timestampOfPhoto);
  const [secondDif, setSecondDif] = useState(0);

  const setTimeDif = (value: number) => {
    setSecondDif(value);
    setTimestampOnTheDial(timestampOfPhoto + value * 1000);
  };

  const finishImage = () => {
    let destination: string;
    if (route.params.watch === 'NEW') {
      destination = 'New';
    } else {
      destination = 'Record';
    }
    navigation && navigation.navigate(destination, {
        watchKey: route.params.watch,
        imageUri: route.params.imageUri,
        timestamp: timestampOfPhoto,
        timestampOnTheDial: timestampOnTheDial,
        secondDif: secondDif,
      },
    );
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );

  const renderDownIcon = (props) => (
    <Icon
      {...props}
      animation='zoom'
      name='chevron-left-outline'
    />
  );

  const renderUpIcon = (props) => (
    <Icon
      {...props}
      animation='zoom'
      name='chevron-right-outline'
    />
  );
  const renderNextAction = (): React.ReactElement => (
    <TouchableOpacity
      onPress={finishImage}>
      <Text category='h6' style={{marginRight: 16}}>Next</Text>
    </TouchableOpacity>
  );
  const timeOnTheDial = new Date(timestampOnTheDial);
  const seconds = timeOnTheDial.getSeconds() + (timeOnTheDial.getMilliseconds() / 1000);
  const plusSign = secondDif >= 0 ? '+' : '';
  const diffString = plusSign + secondDif.toFixed(1);
  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        accessoryLeft={renderBackAction}
        accessoryRight={renderNextAction}
      />
      <Divider/>
      <PhotoView
        source={{uri: route.params.imageUri}}
        minimumZoomScale={1}
        maximumZoomScale={3}
        resizeMode='center'
        style={{width: width, height: width}}
      />
      <Layout style={styles.readTimeContainer}>
        <Text category='h6'>Time On The Dial</Text>
        <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={{marginRight: 16}} onPress={() => {
            setTimeDif(secondDif - 0.1);
          }}>
            <Icon name='chevron-left-outline' width={48} height={48} fill='#212b46'/>
          </TouchableOpacity>
          <Text category='h1'>{timeOnTheDial.getHours().toFixed(0).padStart(2, '0')}:</Text>
          <Text category='h1'>{timeOnTheDial.getMinutes().toFixed(0).padStart(2, '0')}:</Text>
          <Text
            category='h1'>{seconds.toFixed(1).padStart(4, '0')}
          </Text>
          <TouchableOpacity style={{marginLeft: 16}} onPress={() => {
            setTimeDif(secondDif + 0.1);
          }}>
            <Icon name='chevron-right-outline' width={48} height={48} fill='#212b46'/>
          </TouchableOpacity>
        </Layout>
        <Text category='h5' style={{paddingHorizontal: 8}}>{diffString}</Text>
        <Slider
          style={{width: width, height: 40, marginTop: 32}}
          minimumValue={-50}
          maximumValue={50}
          step={0.1}
          value={0}
          onValueChange={value => setTimeDif(value)}
          minimumTrackTintColor='#192038'
          maximumTrackTintColor='#192038'
          thumbTintColor='#232a44'
        />
      </Layout>
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
    height: width,
  },
  readTimeContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 16,
  },
  button: {
    margin: 2,
  },
});
