import { View, Text } from 'react-native';
import React from 'react';
import styles from './style';
import PropTypes from 'prop-types';
import { Images } from '../../config/images';
import LottieView from 'lottie-react-native';

export default function CNoData(props) {

  const { titleText, descriptionText } = props;

  return (
   <>
    <View style={styles.mainView}>
      {/* {/ <Image source={Images.NoData} style={styles.imageStyle} /> /} */}
      <View style={{ height: 200, aspectRatio: 1 }}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          autoPlay
          speed={0.85}
          source={require('../../assets/lottieFiles/empty.json')}
        />
      </View>
      <Text style={styles.PT10}>{titleText}</Text>
      <Text style={[styles.PT10, { fontWeight: 'normal', color: '#353436', fontSize: 15 }]}>{descriptionText}</Text>
    </View>
   </>
  );
}

CNoData.propTypes = {
  titleText: PropTypes.string,
  descriptionText: PropTypes.string,
};

CNoData.defaultProps = {
  titleText: 'Oops 😥',
  descriptionText: "The thing you've been looking for isn't here...	",
};