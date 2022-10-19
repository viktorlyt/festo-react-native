import React from 'react';
import { BaseColors, FontFamily } from '@config/theme';
import { Bubble } from '../../../libs/react-native-gifted-chat';

export const renderBubble = (props) => (
  <Bubble
    {...props}
    textStyle={{
      right: {
        color: BaseColors.black,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FontFamily.regular,
      },
      left: {
        color: BaseColors.black,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FontFamily.regular,
      },
    }}
    wrapperStyle={{
      right: {
        backgroundColor: '#F2F2F2',
        borderRadius: 5,
        color: '#fff',
        marginRight: 10,
      },
      left: {
        backgroundColor: BaseColors.lightRed,
        borderRadius: 5,
        color: '#000',
        marginLeft: 10,
      },
    }}
  />
);
