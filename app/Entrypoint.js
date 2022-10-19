import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { ActivityIndicator, Text, TextInput, LogBox } from 'react-native';
import DatePicker from 'react-native-datepicker';
import codePush from 'react-native-code-push';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { AppearanceProvider } from 'react-native-appearance';
import { ThemeProvider } from '@react-navigation/native';
// import Bugsnag from '@bugsnag/react-native';
import Navigator from 'app/navigation';
import Toast from '@components/Toast';
import CTopNotify from '@components/CTopNotify';
import CStatusBar from '@components/CStatusBar';
import { persistor, store } from './redux/store/configureStore';
import { initTranslate } from './lang/Translate';

// const IOS = Platform.OS === 'ios';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const codePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,

  updateDialog: {
    appendReleaseDescription: true,
    descriptionPrefix: "\n\nWhat's New:",
    mandatoryContinueButtonLabel: 'Install',
  },
};

/**
 * @class EntryPoint
 */
class index extends Component {
  constructor(props) {
    super(props);
    this.notifyToast = React.createRef();
    this.state = {
      processing: false,
      loading: true,
    };

    // Bugsnag.start();
  }

  componentDidMount() {
    codePush.notifyAppReady();
  }

  /* Codepush Events */
  codePushStatusDidChange(status) {
    console.log('Codepush status change ==> ', status);
    this.codepushStatus = status;
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Codepush: Checking for updates.');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({
          processing: true,
        });
        this.showToast('App update is being downloaded');
        console.log('Codepush: Downloading package.');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.showToast('New update is being installed');
        console.log('Codepush: Installing update.');
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('Codepush: Up-to-date.');
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('Codepush: Update installed.');
        break;
    }
  }

  showToast = (message) => {
    if (this.notifyToast?.current) {
      this.notifyToast?.current?.show(message, 2000);
    }
  };

  onBeforeLift = () => {
    if (store) {
      initTranslate(store);
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { processing, loading } = this.state;

    return (
      <AppearanceProvider>
        <ThemeProvider>
          <Provider store={store}>
            <PersistGate
              loading={<ActivityIndicator />}
              persistor={persistor}
              onBeforeLift={this.onBeforeLift}>
              {/* <StatusBar
                backgroundColor={BaseColors.white}
                barStyle={'dark-content'}
              /> */}
              <CStatusBar />
              {loading ? <ActivityIndicator /> : <Navigator />}
              {processing && <CTopNotify title="Installing updates" />}
            </PersistGate>
            <Toast
              ref={this.notifyToast}
              position="top"
              positionValue={100}
              fadeInDuration={750}
              fadeOutDuration={2000}
              opacity={0.8}
            />
          </Provider>
        </ThemeProvider>
      </AppearanceProvider>
    );
  }
}

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
DatePicker.defaultProps = DatePicker.defaultProps || {};
DatePicker.defaultProps.allowFontScaling = false;

let indexExport = index;
if (!__DEV__) {
  indexExport = codePush(codePushOptions)(index);
}

export default indexExport;
