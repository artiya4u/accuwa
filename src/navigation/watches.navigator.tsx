import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WatchesScreen } from '../scenes/watches/watches.component';
import {CaptureScreen} from '../scenes/capture/capture.component';
import {DialScreen} from '../scenes/dial/dial.component';
import {NewWatchScreen} from '../scenes/new/new.component';
import {RecordScreen} from '../scenes/record/record.component';
import {WatchScreen} from '../scenes/watch/watch.component';
import {PreviewScreen} from '../scenes/preview/preview.component';

const Stack = createStackNavigator();

export const WatchesNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Watches' component={WatchesScreen}/>
    <Stack.Screen name='Capture' component={CaptureScreen}/>
    <Stack.Screen name='Dial' component={DialScreen}/>
    <Stack.Screen name='New' component={NewWatchScreen}/>
    <Stack.Screen name='Record' component={RecordScreen}/>
    <Stack.Screen name='Watch' component={WatchScreen}/>
    <Stack.Screen name='Preview' component={PreviewScreen}/>
  </Stack.Navigator>
);
