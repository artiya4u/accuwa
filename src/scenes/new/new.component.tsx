import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {TopNavigation, TopNavigationAction, Text, Layout, Input, Divider} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon} from '../../components/icons';
import {SaveNewWatch} from '../../services/watches.service';

export const NewWatchScreen = ({navigation, route}): React.ReactElement => {

  const [timestampOfPhoto, setTimestampOfPhoto] = useState(route.params.timestamp);
  const [timestampOnTheDial, setTimestampOnTheDial] = useState(route.params.timestampOnTheDial);
  const [secondDif, setSecondDif] = useState(route.params.secondDif);

  const [brand, setBrand] = useState<string>();
  const [model, setModel] = useState<string>();
  const [about, setAbout] = useState<string>();

  const saveWatch = async () => {
    const newWatch = {
      watchKey: `${brand}:${model}`,
      brand: brand,
      model: model,
      about: about,
      imageUri: route.params.imageUri,
      createdAt: new Date().getTime(),
    };
    const record = {
      watchKey: newWatch.watchKey,
      imageUri: route.params.imageUri,
      timestampOfPhoto: timestampOfPhoto,
      timestampOnTheDial: timestampOnTheDial,
      secondDif: secondDif,
      createdAt: new Date().getTime(),
      newPeriod: true,
      note: '',
    };
    SaveNewWatch(newWatch, record).then(function () {
      navigation.navigate('Watches');
    });
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );

  const renderNextAction = (): React.ReactElement => (
    <TouchableOpacity
      onPress={saveWatch}>
      <Text category='h6' style={{marginRight: 16}}>Save</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        accessoryLeft={renderBackAction}
        accessoryRight={renderNextAction}
      />
      <Divider style={{marginBottom: 16}}/>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <Image style={styles.watchImage} source={{
            uri: route.params.imageUri,
          }}/>
          <Layout
            style={styles.form}
            level='1'>
            <Input
              style={styles.input}
              size='medium'
              status='basic'
              label='Brand'
              placeholder='Enter WatchModel Brand'
              maxLength={32}
              value={brand}
              onChangeText={setBrand}
            />
            <Input
              style={styles.input}
              size='medium'
              status='basic'
              label='Model'
              placeholder='WatchModel Model'
              maxLength={32}
              value={model}
              onChangeText={setModel}
            />
            <Input
              style={styles.input}
              size='medium'
              status='basic'
              multiline={true}
              textStyle={{minHeight: 64, textAlignVertical: 'top', marginVertical: 8}}
              label='About'
              placeholder='Write your watch story...'
              value={about}
              onChangeText={setAbout}
            />
          </Layout>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 14,
    color: '#192038',
  },
  watchImage: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 4,
  },
  form: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 24,
  },
  input: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
