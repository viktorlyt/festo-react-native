# Festo-frontend-ReactNative

Festo: A React Native app

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [React-native](https://facebook.github.io/react-native/) - React Native lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI using declarative components.
- [Java jdk](https://www.oracle.com/technetwork/java/javase/downloads/index.html) -Java software for your computer, or the Java Runtime Environment, is also referred to as the Java Runtime, Runtime Environment, Runtime, JRE, Java Virtual Machine, Virtual Machine, Java VM, JVM, VM, Java plug-in, Java plugin, Java add-on or Java download.
- [Android Studio](https://developer.android.com/studio/) - Android Studio provides the fastest tools for building apps on every type of Android device.

## Installation

```bash
# Clone with SSH
git@gitlab.com:f4276/app.git

# Run yarn command will install all modules listed as dependencies in package.json.
yarn

# Run yarn start command will start the admin panel on your computer.
yarn start
```

If you are not able to start the service then please check once the current git branch.

If it's `Main` branch then change it to `development` branch and try again.

```bash
# Change git branch into development
git checkout development

# Then run yarn command will install all modules listed as dependencies in package.json.
yarn
```

### For Setup

- Use this all command in CMD for windows user and terminal for Linux users

#### steps

1. Go to the project directory and type `yarn`.
   (follow below 2,3,4 steps or just follow 5 step alone)
2. Now go to the android directory of your project using `cd android`.
3. Now type `gradlew assembledebug` or `gradlew assemblerelease` for windows user. For linux user `sudo ./gradlew assembledebug` or `sudo ./gradlew assemblerelease`.
4. Now type `gradlew installdebug` or `gradlew installrelease` for windows user. For linux user `sudo ./gradlew installdebug` or `sudo ./gradlew installrelease`.
5. Now type `yarn android`.

### Instructions

1.  For running this app you must install all above Prerequisites and set all
    environment paths correctly.
2.  For debugging app you must run `yarn` in the project directory and chrome
    browser opens this link [debugger](http://localhost:8081/debugger-ui/) for debugging your app.
3.  For step no 3 and only Linux user if `sudo ./gradlew installdebug` command is not working on your
    terminal use this command `sudo chmod 0777 -R gradlew` for change permission and after run step 3
    commands.

## React Native Details:

Libraries / Dependencies utilized

- [@bugsnag/react-native](https://docs.bugsnag.com/platforms/react-native/react-native/): ^7.10.3,
- [@react-native-community/async-storage](https://www.npmjs.com/package/@react-native-community/async-storage):^1.12.1,
- [@react-native-community/masked-view](https://www.npmjs.com/package/@react-native-community/masked-view): ^0.1.11,
- [@react-native-community/netinfo](https://aboutreact.com/react-native-netinfo/): ^6.0.0,
- [@react-native-community/push-notification-ios](https://www.npmjs.com/package/@react-native-community/push-notification-ios/v/1.8.0): ^1.8.0,
- [@react-native-firebase/app](https://www.npmjs.com/package/@react-native-firebase/app/v/11.5.0): 11.5.0,
- [@react-native-firebase/auth](https://www.npmjs.com/package/@react-native-firebase/auth/v/11.5.0): 11.5.0,
- [@react-native-firebase/messaging](https://www.npmjs.com/package/@react-native-firebase/messaging/v/11.5.0): 11.5.0,
- [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin/v/6.0.1): ^6.0.1,
- [@react-native-picker/picker](https://www.npmjs.com/package/@react-native-picker/picker/v/1.16.1): ^1.16.1,
- [@react-navigation/bottom-tabs](https://reactnavigation.org/docs/5.x/getting-started): ^5.11.11,
- [@react-navigation/drawer](https://reactnavigation.org/docs/5.x/getting-started): ^5.12.5,
- [@react-navigation/material-top-tabs](https://reactnavigation.org/docs/5.x/getting-started/): ^5.3.15,
- [@react-navigation/native](https://reactnavigation.org/docs/5.x/getting-started): ^5.9.4,
- [@react-navigation/stack](https://reactnavigation.org/docs/5.x/getting-started): ^5.14.5,
- [react-native-image-crop-picker](https://www.npmjs.com/package/react-native-image-crop-picker/v/0.25.2): ^0.25.2,
- [axios](https://www.npmjs.com/package/axios/v/0.21.1): ^0.21.1,
- [babel-plugin-transform-remove-console](https://www.npmjs.com/package/babel-plugin-transform-remove-console/v/6.9.4): ^6.9.4,
- [i18n-js](https://www.npmjs.com/package/i18n-js/v/3.8.0): ^3.8.0,
- [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js/v/1.9.23):^1.9.23,
- [lodash](https://www.npmjs.com/package/lodash/v/4.17.21):^4.17.21,
- [lottie-ios](https://www.npmjs.com/package/lottie-ios/v/3.2.3): ^3.2.3,
- [lottie-react-native](https://www.npmjs.com/package/lottie-react-native/v/4.0.2): ^4.0.2,
- [moment](https://www.npmjs.com/package/moment/v/2.29.1): ^2.29.1,
- [react](https://reactjs.org/): 17.0.1,
- [react-content-loader](https://www.npmjs.com/package/react-content-loader/v/6.0.3): ^6.0.3,
- [react-native](https://reactnative.dev/docs/0.64/getting-started): 0.64.2,
- [react-native-appearance](https://www.npmjs.com/package/react-native-appearance/v/0.3.4): ^0.3.4,
- [react-native-cli](https://www.npmjs.com/package/react-native-cli/v/2.0.1): ^2.0.1,
- [react-native-code-push](https://www.npmjs.com/package/react-native-code-push/v/7.0.1): ^7.0.1,
- [react-native-fbsdk-next](https://www.npmjs.com/package/react-native-fbsdk-next/v/4.3.0):^4.3.0,
- [react-native-geolocation-service](https://www.npmjs.com/package/react-native-geolocation-service/v/5.3.0-beta.1):^5.3.0-beta.1,
- [react-native-maps](https://www.npmjs.com/package/react-native-maps/v/0.28.0):^0.28.0,
- [react-native-otp-textinput](https://www.npmjs.com/package/react-native-otp-textinput/v/0.0.8):0.0.8,
- [react-native-push-notification](https://www.npmjs.com/package/react-native-push-notification/v/7.3.2):^7.3.2,
- [react-redux](https://www.npmjs.com/package/react-redux/v/7.2.4):^7.2.4,
- [rn-fetch-blob](https://www.npmjs.com/package/rn-fetch-blob/v/0.12.0):^0.12.0,
- [react-native-restart](https://www.npmjs.com/package/react-native-restart/v/0.0.22):^0.0.22,

## README AUTHOR

#### Groovy web firm LLP - [info@groovyweb.firm.in](https://groovyweb.firm.in/)

---


# Lotti Used
https://lottiefiles.com/103110-confetti-pop
https://lottiefiles.com/70096-floating-air-balloon