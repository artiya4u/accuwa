import React from 'react';
import ContentView from '../../layouts/watch/index';

export const WatchScreen = ({navigation, route}): React.ReactElement => {
  return (
    <ContentView navigation={navigation} route={route}/>
  );
};

