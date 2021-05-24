import {ImageSourcePropType} from 'react-native';
import {RecordModel} from './record.model';

export class WatchModel {

  constructor(
    readonly id: string,
    readonly brand: string,
    readonly model: string,
    readonly description: string,
    readonly photo: ImageSourcePropType,
    readonly records: RecordModel[],
  ) {

  }
}
