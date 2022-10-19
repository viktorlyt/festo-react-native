import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { BaseColors } from '@config/theme';
import LottieView from 'lottie-react-native';
import { Images } from '@config/images';
import { StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
/**
 *Display status Bar
 * @function CStatusBar
 */
export default function CStatusBar() {
  const { darkmode } = useSelector((state) => state.auth);
  return (
    <StatusBar
      backgroundColor={darkmode ? BaseColors.black : BaseColors.white}
      barStyle={darkmode ? 'light-content' : 'dark-content'}
    />
  );
}
