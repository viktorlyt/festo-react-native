import { PixelRatio, Platform } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

const iconSize = 22;
const navIconSize =
  __DEV__ === false && Platform.OS === 'android'
    ? PixelRatio.getPixelSizeForLayoutSize(8)
    : iconSize;
const replaceSuffixPattern = /--(active|big|small|very-big)/g;

const CustIcon = {
  profile: [navIconSize, '#7E87AE'],
  chat: [navIconSize, '#7E87AE'],
  'discover-active': [navIconSize, '#7E87AE'],
  notification: [navIconSize, '#7E87AE'],
  list: [navIconSize, '#7E87AE'],
  marker: [navIconSize, '#7E87AE'],
  map: [navIconSize, '#7E87AE'],
  'send-active': [navIconSize, '#7E87AE'],
  send: [navIconSize, '#7E87AE'],
  rate: [navIconSize, '#7E87AE'],
  'camera-o': [navIconSize, '#7E87AE'],
  camera: [navIconSize, '#7E87AE'],
  gallery: [navIconSize, '#7E87AE'],
  'round-forward': [navIconSize, '#7E87AE'],
  user: [navIconSize, '#7E87AE'],
  'chat-active': [navIconSize, '#7E87AE'],
  'profile-active': [navIconSize, '#7E87AE'],
  backward: [navIconSize, '#7E87AE'],
  party: [navIconSize, '#7E87AE'],
  'marker-active': [navIconSize, '#7E87AE'],
  'calender-active': [navIconSize, '#7E87AE'],
  calender: [navIconSize, '#7E87AE'],
  'party-active': [navIconSize, '#7E87AE'],
  price: [navIconSize, '#7E87AE'],
  timer: [navIconSize, '#7E87AE'],
  attach: [navIconSize, '#7E87AE'],
  'Path-28': [navIconSize, '#7E87AE'],
  location: [navIconSize, '#7E87AE'],
  edit: [navIconSize, '#7E87AE'],
  gender: [navIconSize, '#7E87AE'],
  'Path-176': [navIconSize, '#7E87AE'],
  discover: [navIconSize, '#7E87AE'],
  'party-fill': [navIconSize, '#7E87AE'],
  'add-round': [navIconSize, '#7E87AE'],
  'Group-26': [navIconSize, '#7E87AE'],
  'Group-27': [navIconSize, '#7E87AE'],
  'Group-28': [navIconSize, '#7E87AE'],
  'Group-29': [navIconSize, '#7E87AE'],
};

const iconsArray = [[CustIcon, CustomIcon]];

const iconsMap = {};
const iconsLoaded = new Promise((resolve) => {
  const allFonts = [iconsArray].map((iconArrayMain) =>
    Promise.all(
      iconArrayMain.map((iconArray) =>
        Promise.all(
          Object.keys(iconArray[0]).map((iconName) =>
            // IconName--suffix--other-suffix is just the mapping name in iconsMap
            iconArray[1].getImageSource(
              iconName.replace(replaceSuffixPattern, ''),
              iconArray[0][iconName][0],
              iconArray[0][iconName][1],
            ),
          ),
        ).then(
          (sources) =>
            Object.keys(iconArray[0]).forEach(
              (iconName, idx) => (iconsMap[iconName] = sources[idx]),
            ),
          // resolve(true);
        ),
      ),
    ).then(() => {
      resolve(true);
    }),
  );

  return Promise.all(allFonts);
});

export { iconsMap, iconsLoaded, CustomIcon };
