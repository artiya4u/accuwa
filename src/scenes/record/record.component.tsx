import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {TopNavigation, TopNavigationAction, Text, Layout, Input, Toggle, Divider} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon} from '../../components/icons';
import {SaveWatchRecord} from '../../services/watches.service';

const {width} = Dimensions.get('window');

export const RecordScreen = ({navigation, route}): React.ReactElement => {

  const [timestampOfPhoto, setTimestampOfPhoto] = useState(route.params.timestamp);
  const [timestampOnTheDial, setTimestampOnTheDial] = useState(route.params.timestampOnTheDial);
  const [secondDif, setSecondDif] = useState(route.params.secondDif);

  const [note, setNote] = useState<string>();
  const [checked, setChecked] = React.useState(false);

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  const saveWatchRecord = async () => {
    const record = {
      watchKey: route.params.watchKey,
      imageUri: route.params.imageUri,
      timestampOfPhoto: timestampOfPhoto,
      timestampOnTheDial: timestampOnTheDial,
      secondDif: secondDif,
      createdAt: new Date().getTime(),
      newPeriod: checked,
      note: note,
    };
    SaveWatchRecord(record).then(function () {
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
      onPress={saveWatchRecord}>
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
      <Divider/>
      <ScrollView>
        <Image style={styles.watchImage} source={{
          uri: route.params.imageUri,
        }}/>
        <KeyboardAvoidingView style={styles.container}>
          <Layout
            style={styles.form}
            level='1'>
            <Input
              size='medium'
              status='basic'
              multiline={true}
              textStyle={{minHeight: 64, textAlignVertical: 'top'}}
              placeholder='Your personal note...'
              value={note}
              onChangeText={setNote}
              label='Note:'
            />
          </Layout>
          <Divider/>
          <Layout style={styles.toggleRow}>
            <Text style={styles.labelText}>New Period:</Text>
            <Toggle status='basic' checked={checked} onChange={onCheckedChange}/>
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
