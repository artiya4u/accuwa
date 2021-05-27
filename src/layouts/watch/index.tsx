import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image, ImageBackground, ListRenderItemInfo,
  ScrollView, TouchableOpacity,
} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Text,
  Layout,
  Divider,
  StyleService,
} from '@ui-kitten/components';
import {SafeAreaLayout} from '../../components/safe-area-layout.component';
import {ArrowIosBackIcon} from '../../components/icons';
import {WatchService} from '../../services/watch.service';
import {RecordList} from './extra/record-list.component';
import {RecordModel} from '../../model/record.model';

const {width} = Dimensions.get('window');

export default ({navigation, route}): React.ReactElement => {
  const [watch, setWatch] = useState(route.params.watch);

  const watchRecords = [];
  const watchRecordsTitle = [];
  let records = [];
  if (watch.records.length > 0) { // Prevent deleted first new record.
    watch.records[watch.records.length - 1].newPeriod = true;
  }
  for (const r of watch.records) {
    records.push(r);
    if (r.newPeriod) {
      const startDate = new Date(records[records.length - 1].timestampOfPhoto).toDateString();
      const endDate = new Date(records[0].timestampOfPhoto).toDateString();
      let title = startDate + ' - ' + endDate;
      if (startDate === endDate) {
        title = startDate;
      }
      const periodAvg = WatchService.formatRate(WatchService.getAverageRate(records).avg);
      if (periodAvg !== '-') {
        title = periodAvg + ' s/d ' + title;
      }
      watchRecordsTitle.push(title);
      watchRecords.push(records);
      records = [];
    }
  }

  const renderPostItem = (info: ListRenderItemInfo<RecordModel>): React.ReactElement => (
    <TouchableOpacity onPress={function () {
      navigation.navigate('Preview', info.item);
    }}>
      <ImageBackground
        style={styles.postItem}
        source={{uri: info.item.imageUri}}
      />
    </TouchableOpacity>
  );

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={navigation.goBack}
    />
  );

  const getDiv = () => {
    if (watch.records.length === 0) {
      return '-';
    }
    return WatchService.formatRate(watch.records[0].secondDif);
  };

  return (
    <SafeAreaLayout
      style={styles.container}
      insets='top'>
      <TopNavigation
        accessoryLeft={renderBackAction}
        title={watch.brand + ' - ' + watch.model}
      />
      <Divider/>
      <ScrollView>
        <Layout style={{paddingHorizontal: 16, paddingTop: 16}}>
          <Layout style={{flexDirection: 'row'}}>
            <Image style={styles.watchImage} source={watch.photo}/>
            <Layout style={{paddingLeft: 16}}>
              <Text category='h5' style={{marginRight: 8}}>{watch.brand}</Text>
              <Text category='h6'>{watch.model}</Text>
            </Layout>
          </Layout>
        </Layout>
        <Layout style={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8}}>
          <Text category='p1'>{watch.description}</Text>
        </Layout>
        <Divider/>
        <Layout style={{paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Layout style={{alignItems: 'center'}}>
            <Text category='h5'>
              {WatchService.formatRate(WatchService.getAverageRate(watch.records).avg)} s/d
            </Text>
            <Text category='h6'>avg. rate</Text>
          </Layout>
          <Layout style={{alignItems: 'center'}}>
            <Text category='h5'>
              {WatchService.formatRate(WatchService.getAverageRate(watch.records).rates[0])} s/d
            </Text>
            <Text category='h6'>last rate</Text>
          </Layout>
          <Layout style={{alignItems: 'center'}}>
            <Text category='h5'>{getDiv()} s</Text>
            <Text category='h6'>div</Text>
          </Layout>
        </Layout>
        <Divider/>
        <Layout style={{paddingBottom: 16}}>
          {watchRecords.map((prop, key) => {
            return (
              <RecordList
                key={key.toString()}
                contentContainerStyle={styles.postsList}
                hint={watchRecordsTitle[key]}
                data={[...prop]}
                renderItem={renderPostItem}
              />
            );
          })}
        </Layout>
      </ScrollView>
    </SafeAreaLayout>
  );
};

const styles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 16,
  },
  labelText: {
    fontSize: 14,
    color: '#192038',
  },
  watchImage: {
    alignSelf: 'flex-start',
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
  postsList: {
    paddingHorizontal: 8,
  },
  postItem: {
    width: 144,
    height: 144,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
});
