import React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BaseColors } from '@config/theme';
import { Text } from '@components';
import styles from './styles';

const FormModal = (props) => {
  const { rbSheetRef, title, children, onClose } = props;
  const IOS = Platform.OS === 'ios';

  return (
    <RBSheet
      onClose={onClose ? onClose : null}
      ref={rbSheetRef}
      dragFromTopOnly={false}
      closeOnPressMask={true}
      closeOnDragDown={true}
     
      height={Dimensions.get('window').height - (IOS ? 50 : 30)}
      customStyles={{
        draggableIcon: {
          backgroundColor:BaseColors.primary,
          width: 51,
        },
        container: {
          backgroundColor: BaseColors.white,
          borderTopRightRadius: 45,
          borderTopLeftRadius: 45,
        },
      }}>
      <View style={styles.titleContainer}>
        <Text style={styles.Text1}>{title}</Text>
      </View>
      {children}
    </RBSheet>
  );
};

export default FormModal;
