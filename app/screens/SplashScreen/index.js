import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Images } from '@config';
import { enableAnimateInEaseOut } from '@utils/CommonFunction';
import styles from './styles';

const SplashScreen = ({ navigation }) => {
  const { userData, accessToken } = useSelector((state) => state.auth);
  const introScreens = useSelector((state) => state.auth.introScreens);
  const animation = useSharedValue(500);
  const animation1 = useSharedValue(500);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            animation.value,
            {
              duration: 800,
            },
            () => {
              animation.value = 0;
            },
          ),
        },
      ],
    };
  });
  const animationStyle1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            animation1.value,
            {
              duration: 900,
            },
            () => {
              animation1.value = 8;
            },
          ),
        },
      ],
    };
  });

  useEffect(() => {
    animation.value = 1000;
    animation1.value = 1000;

    setTimeout(() => {
      if (accessToken) {
        if (userData?.isProfileSetup === 0) {
          navigation.reset({
            routes: [{ name: 'Create_Profile', from: 'splash' }],
          });
        } else if (userData?.isIntrestAdded === 0) {
          navigation.reset({
            routes: [{ name: 'AddIntrest', from: 'splash' }],
          });
        } else {
          navigation.reset({
            routes: [{ name: 'Party' }],
          });
        }
      } else {
        // navigation.navigate('Intro');
        navigation.reset({
          routes: [{ name: 'Intro' }],
        });
      }
    }, 3000);
  }, []);

  enableAnimateInEaseOut();
  return (
    <>
      <StatusBar
        backgroundColor={'#0000'}
        translucent
        barStyle="light-content"
      />

      <View style={styles.centerCon}>
        <Animated.View style={animationStyle}>
          <Animated.Image
            style={[styles.logoImg, animationStyle1]}
            source={Images.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </>
  );
};

export default SplashScreen;
