import types from './actions';

const initialState = {
  userData: {},
  accessToken: '',
  userType: '', // user type 'Customer' || 'ServiceProvider'
  introScreens: true,
  askLocationPermission: false,
  baseColor: {},
  darkmode: false,
  activeScreen: '',
  interestList: [],
  isBankAccountAdded: 0,
  currentLocation: {},
  activeChatUser: null,
  bottomTabSwipe: true,
};

export default function reducer(state = initialState, action) {
  // console.log('Reducer Change AUTH ===> ', action.type, action);
  switch (action.type) {
    case 'persist/REHYDRATE':
      if (
        action.payload &&
        action.payload.auth &&
        action.payload.auth.introShown
      ) {
        return {
          ...state,
          ...action.payload.auth,
          introShown: false,
        };
      }
      return state;
    case types.SET_USER_DATA:
      console.log(`${types.SET_USER_DATA} => `);
      return {
        ...state,
        userData: action.userData,
      };
    case types.SET_CURRENT_LOCATION:
      console.log(`${types.SET_CURRENT_LOCATION} => `, action.currentLocation);
      return {
        ...state,
        currentLocation: action.currentLocation,
      };
    case types.SET_ACCESSTOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case types.SET_BANK_ACCOUNT:
      return {
        ...state,
        isBankAccountAdded: action.isBankAccountAdded,
      };
    case types.SET_USERTYPE:
      return {
        ...state,
        userType: action.userType,
      };
    case types.SET_INTRO:
      return {
        ...state,
        introScreens: action.introScreens,
      };
    case types.SET_ACTIVE_CHAT_USER:
      return {
        ...state,
        activeChatUser: action.activeChatUser,
      };
    case types.LOGOUT:
      return {
        ...state,
        userData: {},
        accessToken: '',
        userType: '',
        coins: 0,
      };
    case types.SET_LOCATION_PERMISSION:
      return {
        ...state,
        askLocationPermission: action.askLocationPermission,
      };
    case types.SET_BASECOLOR:
      return {
        ...state,
        baseColor: action.baseColor,
      };
    case types.SET_DARKMODE:
      console.log('DARKMODE REDUX ==>> ', action.darkmode);
      return {
        ...state,
        darkmode: action.darkmode,
      };
    case types.SET_ACTIVE_SCREEN:
      return {
        ...state,
        activeScreen: action.activeScreen,
      };
    case types.SET_INTEREST_LIST:
      return {
        ...state,
        interestList: action.interestList,
      };
    case types.SET_BOTTOM_TAB_SWIPE:
      return {
        ...state,
        bottomTabSwipe: action.swipe,
      };
    default:
      return state;
  }
}
