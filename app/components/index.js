import React from 'react';
import GradientContainer from '@components/UI/GradientContainer';
import Button from '@components/UI/Button';
import TabSwitch from '@components/UI/TabSwitch';
import Text from '@components/UI/Text';
import TextInput from '@components/UI/TextInput';
import DropDown from '@components/UI/DropDown';
import CHeader from '@components/Header';
import DiscoverMapList from '@components/UI/DiscoverMapList';
import DiscoverCardList from '@components/UI/DiscoverCardList';
import IconComponent from '@components/UI/IconComponent';
import NoInternet from '@screens/NoInternet';
import CStatusBar from '@components/CStatusBar';
import LightBoxContainer from '@components/LightBox';
import EventJoiner from '@components/EventJoiner';
import AlertModal from '@components/AlertModal';
import MidModal from '@components/UI/MidModal';
import SelectPhotoModal from '@components/SelectPhotoModal';
import ListModal from '@components/ListModal';
import CDropDown from '@components/CDropDown';
import FriendListModal from '@components/FriendListModal';
import ContentLoader from '@components/ContentLoader';
import CUploadImages from '@components/CUploadImages';
import Header from '@components/UI/Header';

const GlobalContext = React.createContext();
const NotificationContext = React.createContext();

export {
  GradientContainer,
  Button,
  TabSwitch,
  Text,
  TextInput,
  DropDown,
  CHeader,
  Header,
  IconComponent,
  GlobalContext,
  NotificationContext,
  NoInternet,
  DiscoverMapList,
  DiscoverCardList,
  EventJoiner,
  CStatusBar,
  AlertModal,
  LightBoxContainer,
  MidModal,
  SelectPhotoModal,
  ListModal,
  CDropDown,
  FriendListModal,
  ContentLoader,
  CUploadImages,
};
