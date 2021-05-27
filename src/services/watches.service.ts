import {RecordModel} from '../model/record.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WatchModel} from '../model/watch.model';

export async function WatchesLoad() {
  // await AsyncStorage.clear();
  const watchListStr = await AsyncStorage.getItem(`WATCHLIST`);
  let watchListStore = JSON.parse(watchListStr);
  if (watchListStore === null) {
    watchListStore = [];
  }
  const loadedWatchList = [];
  for (const watchKey of watchListStore) {
    const watchStr = await AsyncStorage.getItem(`WATCH:${watchKey}`);
    const w = JSON.parse(watchStr);
    const recordsStr = await AsyncStorage.getItem(`RECORD:${watchKey}`);
    const records = JSON.parse(recordsStr);
    const res = [];
    for (const r of records) {
      res.push(new RecordModel(
        w.watchKey,
        r.imageUri,
        r.timestampOfPhoto,
        r.timestampOnTheDial,
        r.secondDif,
        r.createdAt,
        r.newPeriod,
        r.note),
      );
    }
    const watch = new WatchModel(
      watchKey,
      w.brand,
      w.model,
      w.about,
      {
        uri: w.imageUri,
      },
      res.reverse(),
    );
    loadedWatchList.push(watch);
  }
  return loadedWatchList;
}

export async function SaveWatchRecord(record) {
  const watchRecordStr = await AsyncStorage.getItem(`RECORD:${record.watchKey}`);
  let watchRecords = JSON.parse(watchRecordStr);
  if (watchRecords === null) {
    watchRecords = [];
  }
  watchRecords.push(record);
  await AsyncStorage.setItem(`RECORD:${record.watchKey}`, JSON.stringify(watchRecords));
}

export async function SaveNewWatch(watch, record) {
  await AsyncStorage.setItem(`WATCH:${watch.watchKey}`, JSON.stringify(watch));
  await AsyncStorage.setItem(`RECORD:${watch.watchKey}`, JSON.stringify([record]));
  const watchListStr = await AsyncStorage.getItem(`WATCHLIST`);
  let watchList = JSON.parse(watchListStr);
  if (watchList === null) {
    watchList = [];
  }
  watchList.push(watch.watchKey);
  await AsyncStorage.setItem(`WATCHLIST`, JSON.stringify(watchList));
}

export async function DeleteWatchRecord(record) {
  const watchRecordStr = await AsyncStorage.getItem(`RECORD:${record.watchKey}`);
  let watchRecords = JSON.parse(watchRecordStr);
  if (watchRecords === null) {
    watchRecords = [];
  }
  const filtered = watchRecords.filter(function(value, index, arr) {
    return value.timestampOfPhoto !== record.timestampOfPhoto;
  });
  await AsyncStorage.setItem(`RECORD:${record.watchKey}`, JSON.stringify(filtered));
}

