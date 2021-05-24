import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, TopNavigation } from '@ui-kitten/components';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { data } from './data';
import ContentView from '../../layouts/feed/feed';

export const LayoutsScreen = (props): React.ReactElement => {

  const onItemPress = (index: number): void => {
    props.navigation.navigate(data[index].route);
  };

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='ACCUWA'
      />
      <Divider style={{marginBottom: 8}}/>
      <ContentView navigation={props.navigation}/>
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
