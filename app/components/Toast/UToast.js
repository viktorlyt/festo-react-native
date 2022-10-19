import { BaseColors } from '@config/theme';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { styles } from './BaseToast.styles';
import { Touchable } from './Touchable';
export function UToast({
  text1,
  text2,
  onPress,
  activeOpacity,
  style,
  touchableContainerProps,
  contentContainerStyle,
  contentContainerProps,
  text1Style,
  text1NumberOfLines = 1,
  text1Props,
  text2Style,
  text2NumberOfLines = 1,
  text2Props,
  renderLeadingIcon,
  renderTrailingIcon,
  type,
}) {
  return (
    <Touchable
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={[styles.base, style]}
      {...touchableContainerProps}>
      {renderLeadingIcon && renderLeadingIcon()}
      <View
        style={[styles.contentContainer, contentContainerStyle]}
        {...contentContainerProps}>
        <View style={{ position: 'absolute', right: -160, top: -20 }}>
          {type == 'success' ? (
            <SvgXml
              xml={`<svg width="50" height="50" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M38.9999 68.64C57.9543 68.64 73.3199 53.2744 73.3199 34.32C73.3199 15.3656 57.9543 0 38.9999 0C20.0455 0 4.67993 15.3656 4.67993 34.32C4.67993 44.9926 9.5515 54.5274 17.1923 60.822C17.2045 60.832 17.1936 60.8515 17.1787 60.8464C17.1695 60.8433 17.16 60.8501 17.16 60.8598V71.5042C17.16 74.4834 20.3001 76.4171 22.9605 75.076L34.9719 69.0212C35.6354 68.6867 36.3786 68.5494 37.1205 68.5894C37.7427 68.623 38.3693 68.64 38.9999 68.64Z" fill="${BaseColors.primaryDark}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M50.3012 24.3464C51.3603 25.1585 51.5625 26.6745 50.7531 27.7357L38.7428 43.4829C38.3193 44.0382 37.6774 44.3832 36.9817 44.4295C36.2861 44.4758 35.6044 44.2189 35.1114 43.7246L27.4884 36.0815C26.5456 35.1363 26.5456 33.6064 27.4884 32.6612C28.4346 31.7124 29.9715 31.7124 30.9177 32.6612L36.5784 38.3368L46.9033 24.7994C47.7155 23.7344 49.2382 23.5314 50.3012 24.3464Z" fill="white"/>
  </svg>`}
              width={Dimensions.get('screen').width}
            />
          ) : (
            <SvgXml
              xml={`<svg
              width="50"
              height="50"
              viewBox="0 0 78 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M47.8055 67.6794C48.1344 67.4706 48.4933 67.3124 48.8664 67.2006C63.0117 62.962 73.3199 49.8448 73.3199 34.32C73.3199 15.3656 57.9543 0 38.9999 0C20.0455 0 4.67993 15.3656 4.67993 34.32C4.67993 47.8227 12.4777 59.5042 23.8158 65.1068C23.8286 65.1132 23.8233 65.1326 23.8091 65.1315V65.1315C23.7999 65.1308 23.793 65.1396 23.7957 65.1483L26.9037 74.9903C27.6946 77.4949 30.6437 78.5705 32.8614 77.1631L47.8055 67.6794Z"
                fill="${BaseColors.primaryDark}"
              />
              <path
                d="M48.8134 27.6379C49.6418 26.8095 49.6419 25.4664 48.8134 24.638L48.362 24.1865C47.5336 23.3581 46.1904 23.3581 45.362 24.1865L39 30.5486L32.6379 24.1865C31.8095 23.3581 30.4664 23.3581 29.638 24.1865L29.1865 24.638C28.3581 25.4664 28.3581 26.8095 29.1865 27.6379L35.5486 34L29.1865 40.362C28.3581 41.1904 28.3581 42.5336 29.1865 43.362L29.638 43.8134C30.4664 44.6419 31.8095 44.6419 32.6379 43.8134L39 37.4514L45.362 43.8134C46.1904 44.6419 47.5336 44.6419 48.362 43.8134L48.8134 43.362C49.6419 42.5336 49.6419 41.1904 48.8134 40.362L42.4514 34L48.8134 27.6379Z"
                fill="white"
              />
            </svg>`}
            width={Dimensions.get('screen').width}
          />
          )}
        </View>
        <View style={{ position: 'absolute', right: -140, top: 37 }}>
          <SvgXml
            xml={`<svg width="46" height="43" viewBox="0 0 92 86" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="33.9429" cy="35.8292" r="6.82918" fill="${BaseColors.primaryDark}"/>
<circle cx="79" cy="26" r="13" fill="${BaseColors.primaryDark}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.5511 48.4389C32.4191 47.7782 31.9357 47.2428 31.2918 47.0442C30.5686 46.8212 29.7827 47.0647 29.3124 47.6576L26.6097 51.0648C24.7585 53.3984 21.7904 54.5017 18.8235 54.2372C11.5519 53.5888 4.04597 54.1701 -3.42021 56.1407C-37.9518 65.255 -58.5567 100.637 -49.4425 135.169C-40.3282 169.7 -4.9463 190.305 29.5853 181.191C64.1169 172.077 84.7218 136.695 75.6076 102.163C70.3813 82.3617 56.5177 67.1397 39.13 59.4748C36.2342 58.1983 34.0008 55.6968 33.3809 52.5935L32.5511 48.4389Z" fill="${BaseColors.primaryDark}"/>
<circle cx="21.5475" cy="3.5476" r="3.49096" transform="rotate(-22.0902 21.5475 3.5476)" fill="${BaseColors.primaryDark}"/>
</svg>`}
            width={Dimensions.get('screen').width}
          />
        </View>

        {text1 && text1.length > 0 && (
          <Text
            style={[styles.text1, text1Style]}
            numberOfLines={text1NumberOfLines}
            ellipsizeMode="tail"
            {...text1Props}>
            {text1}
          </Text>
        )}
        {text2 && text2?.length > 0 && (
          <Text
            style={[styles.text2, text2Style]}
            numberOfLines={text2NumberOfLines}
            ellipsizeMode="tail"
            {...text2Props}>
            {text2}
          </Text>
        )}
      </View>
      {renderTrailingIcon && renderTrailingIcon()}
    </Touchable>
  );
}
