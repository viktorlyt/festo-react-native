import React from 'react';
import { Avatar } from '../../../libs/react-native-gifted-chat';

// From renderAvatar function you can design the Avatar of the Chat user.
export const renderAvatar = (props) => (
  <Avatar
    {...props}
    containerStyle={{
      right: {
        marginLeft: 2,
        marginBottom: 10,
      },
      left: {
        marginRight: 2,
        marginBottom: 10,
      },
    }}
    imageStyle={{
      right: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginBottom: 30,
      },
      left: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginBottom: 30,
      },
    }}
  />
);
