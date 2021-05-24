import React from 'react';
import { Icon, IconElement } from '@ui-kitten/components';
import { ImageStyle } from 'react-native';

export const RateIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} width={16} height={16}  name='activity'/>
);

export const AddIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} width={28} height={28}  name='plus-outline' fill='#212b46'/>
);

export const CaptureIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} width={42} height={42} pack='app' name='capture' fill='#212b46'/>
);
