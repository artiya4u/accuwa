export class RecordModel {

  constructor(
    readonly watchKey: string,
    readonly imageUri: string,
    readonly timestampOfPhoto: number,
    readonly timestampOnTheDial: number,
    readonly secondDif: number,
    readonly createdAt: number,
    readonly newPeriod: boolean,
    readonly note: string,
  ) {

  }
}
