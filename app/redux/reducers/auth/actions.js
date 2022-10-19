const actions = {
  SET_USER_DATA: 'auth/SET_USER_DATA',
  SET_ACCESSTOKEN: 'auth/SET_ACCESSTOKEN',
  SET_INTRO: 'auth/SET_INTRO',
  LOGOUT: 'auth/LOGOUT',
  SET_LOCATION_PERMISSION: 'auth/SET_LOCATION_PERMISSION',
  SET_USERTYPE: 'auth/SET_USERTYPE',
  SET_DARKMODE: 'auth/SET_DARKMODE',
  SET_BASECOLOR: 'auth/SET_BASECOLOR',
  SET_ACTIVE_SCREEN: 'SET_ACTIVE_SCREEN',
  SET_INTEREST_LIST: 'SET_INTEREST_LIST',
  SET_BANK_ACCOUNT: 'SET_BANK_ACCOUNT',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',
  SET_ACTIVE_CHAT_USER: 'chat/SET_ACTIVE_CHAT_USER',
  SET_BOTTOM_TAB_SWIPE: 'SET_BOTTOM_TAB_SWIPE',

  setUserData: (data) => {
    return (dispatch) =>
      dispatch({
        type: actions.SET_USER_DATA,
        userData: data,
      });
  },

  setUserCurrentLocation: (currentLocation) => {
    return (dispatch) =>
      dispatch({
        type: actions.SET_CURRENT_LOCATION,
        currentLocation: currentLocation,
      });
  },

  setAccessToken: (accessToken) => (dispatch) =>
    dispatch({
      type: actions.SET_ACCESSTOKEN,
      accessToken,
    }),

  setIsBankAccountAdded: (isBankAccountAdded) => (dispatch) =>
    dispatch({
      type: actions.SET_BANK_ACCOUNT,
      isBankAccountAdded,
    }),

  setUserType: (userType) => (dispatch) =>
    dispatch({
      type: actions.SET_USERTYPE,
      userType,
    }),

  setIntro: (introScreens) => (dispatch) =>
    dispatch({
      type: actions.SET_INTRO,
      introScreens,
    }),

  setActiveChatUser: (activeChatUser) => (dispatch) =>
    dispatch({
      type: actions.SET_ACTIVE_CHAT_USER,
      activeChatUser,
    }),

  logOut: () => (dispatch, getState) => {
    // const IOSocket = getState().socket.IOSocket;
    // if (IOSocket) {
    //   IOSocket.disconnect();
    //   dispatch(socketActions.disconnectCall());
    //   dispatch(socketActions.clearChatData());
    // }
    dispatch({
      type: actions.LOGOUT,
    });
  },

  setLocationPermission: (askLocationPermission) => (dispatch) =>
    dispatch({
      type: actions.SET_LOCATION_PERMISSION,
      askLocationPermission,
    }),
  setBaseColor: (baseColor) => (dispatch) =>
    dispatch({
      type: actions.SET_BASECOLOR,
      baseColor,
    }),

  setDarkmode: (darkmode) => (dispatch) =>
    dispatch({
      type: actions.SET_DARKMODE,
      darkmode,
    }),
  setActiveScreen: (activeScreen) => (dispatch) =>
    dispatch({
      type: actions.SET_ACTIVE_SCREEN,
      activeScreen,
    }),

  setInterestList: (interestList) => (dispatch) =>
    dispatch({
      type: actions.SET_INTEREST_LIST,
      interestList,
    }),

  setBottomTabSwipe: (swipe) => (dispatch) =>
    dispatch({
      type: actions.SET_BOTTOM_TAB_SWIPE,
      swipe,
    }),
};

export default actions;
