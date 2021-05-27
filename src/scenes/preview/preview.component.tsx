import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import {TopNavigation, TopNavigationAction, Layout, Divider} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon, TrashIcon} from '../../components/icons';
import {DeleteWatchRecord} from '../../services/watches.service';

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
        <Image style={styles.watchImage} source={{
          uri: route.params.imageUri,
        }}/>
      </Layout>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
