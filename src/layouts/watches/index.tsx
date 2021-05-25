import React, {useEffect, useState} from 'react';
import {ImageBackground, ListRenderItemInfo, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, List, Text} from '@ui-kitten/components';
import {AddIcon, CaptureIcon, RateIcon} from './extra/icons';
import {WatchService} from '../../services/watch.service';
import {WatchModel} from '../../model/watch.model';
import {WatchesLoad} from '../../services/watches.service';

export default ({navigation}): React.ReactElement => {

  const [watchList, setWatchList] = useState<WatchModel[]>();

  const renderItemHeader = (info: ListRenderItemInfo<WatchModel>): React.ReactElement => (
    <ImageBackground
      style={styles.itemHeader}
      source={info.item.photo}>
    </ImageBackground>
  );

  useEffect(() => {
    const fetchData = async () => {
      setWatchList(await WatchesLoad());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData().then();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const renderFooter = (): React.ReactElement => (
    <Card
      onPress={event => {
        navigation.navigate('Capture', {watch: 'NEW'});
      }}
      style={styles.itemAdd}>
      <AddIcon/>
    </Card>
  );

  const renderItem = (info: ListRenderItemInfo<WatchModel>): React.ReactElement => {
    return (
      <Card
        onPress={event => {
          navigation.navigate('Watch', {watch: info.item});
        }}
        style={styles.item}
        header={() => renderItemHeader(info)}>
        <View style={styles.listItemContainer}>
          <View>
            <Text
              style={styles.itemTitle}
              category='h6'>
              {info.item.brand} {info.item.model !== '' ? '-' : ''} {info.item.model}
            </Text>
            <View style={styles.watchRateContainer}>
              <RateIcon/>
              <Text
                style={styles.itemRate}
                category='s1'>
                {WatchService.formatRate(WatchService.getAverageRate(info.item.records).avg)} s/d
              </Text>
            </View>
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={event => {
              navigation.navigate('Capture', {
                watch: info.item.id,
              });
            }}>
              <CaptureIcon/>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <List
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={watchList}
      ListFooterComponent={renderFooter}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContent: {
    paddingHorizontal: 8,
    marginTop: -4,
    paddingBottom: 8,
  },
  item: {
    marginVertical: 4,
  },
  itemAdd: {
    marginVertical: 4,
    alignItems: 'center',
  },
  itemHeader: {
    minHeight: 360,
  },
  itemTitle: {
    marginHorizontal: 0,
  },
  itemRate: {
    marginHorizontal: 4,
  },
  watchRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
