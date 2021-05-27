import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import {TopNavigation, TopNavigationAction, Layout, Divider} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon, TrashIcon} from '../../components/icons';
import {DeleteWatchRecord} from '../../services/watches.service';
import PhotoView from 'react-native-photo-view-ex';

const {width} = Dimensions.get('window');

export const PreviewScreen = ({navigation, route}): React.ReactElement => {

  const deleteWatchRecord = async () => {
    await DeleteWatchRecord(route.params);
    navigation.goBack();
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );

  const renderNextAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={TrashIcon}
      onPress={deleteWatchRecord}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        accessoryLeft={renderBackAction}
        accessoryRight={renderNextAction}
      />
      <Divider/>
      <Layout style={{alignItems: 'center'}}>
      <PhotoView
        source={{uri: route.params.imageUri}}
        minimumZoomScale={1}
        maximumZoomScale={3}
        resizeMode='center'
        style={{width: width, height: width}}
      />
      </Layout>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 16,
    color: '#192038',
  },
  watchImage: {
    width: width,
    height: width,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  input: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
