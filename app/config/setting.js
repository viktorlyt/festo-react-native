import { Dimensions } from 'react-native';
const devMode = __DEV__;
const baseUrl = devMode
  ? 'https://api.festoapp.co.uk/v1/'
  : 'https://api.festoapp.co.uk/v1/';
// : 'http://192.168.0.182/festo/v1/';

// const baseUrl = 'http://192.168.0.185/festo/v1/';

const BaseSetting = {
  name: 'festo',
  displayName: 'festo',
  appVersionCode: '1',
  stripeKey:
    'pk_test_51Kw3GOIyhcMj6DySJF9HS3yUiaMfJqFq87QAOMR9tthSf53j8kEgLyNuCCZVmjTvYbcBB36gUoIqaFYpgs0ELtxm001P7oUrtP',
  // bugsnagApiKey: "",
  baseUrl,
  socketURL: 'http://134.122.111.37/', //LIVE URL
  // socketURL: 'http://192.168.0.185:33969/', //LOCAL URL
  api: baseUrl,
  shareEndPoint: baseUrl,
  nWidth: Dimensions.get('window').width,
  nHeight: Dimensions.get('window').height,
  timeOut: 30000,
  MAPS_API_CALL_KEY: 'AIzaSyAtRoN67EWe9K1x0vIoncr3DzjP9QYQzAQ',

  endpoints: {
    login: 'user/sign-up',
    OtpVerify: 'user/verify-otp',
    ResendOTP: 'user/resend-otp',
    interestList: 'system/interest-list',
    addIntrest: 'user/add-interest',
    listParty: 'party/list-party',
    seeAll: 'party/list-all-parties-by-interest',
    getPages: 'cms/cms-detail',
    myParties: 'user/my-parties',
    getDropDown: 'system/dropdown',
    addBankAccoutn: 'user/add-bank-account',
    searchList: 'user/search-list',
    search: 'user/search',
    removeSearch: 'user/remove-search',
    logOut: 'user/logout',
    seeAllPeople: 'user/see-all-people',

    //Profile Api
    editImg: 'user/edit-photo',
    BlockUser: 'user/block-user',
    userDetail: 'user/user-details',
    myProfileData: 'user/my-profile',
    editProfile: 'user/edit-profile',
    unFriendUser: 'user/unfriend-user',
    friendList: 'user/user-friend-list',
    createProfile: 'user/create-profile',

    //Add Friends
    userList: 'user/user-list',
    addFriend: 'user/add-friend',
    cancelFriend: 'user/cancel-friend-request',
    totalFriends: 'user/user-friend-list',

    //Party screen API
    partyList: 'user/party',
    inviteFriends: 'party/invite-friend-list',
    invitedFrndList: 'party/invited-friends-list',
    partyDetails: 'party/party-details',
    requestToJoin: 'party/request-to-join',
    userParties: 'party/user-parties',
    commentList: 'party/comment-list',
    commentReplyList: 'party/comment-reply-list',
    addComment: 'party/add-comment',
    sendPartyInvitation: 'party/send-invitation',
    addPartyRatings: 'party/add-rating',
    createParty: 'party/create-party',
    uploadPartyImages: 'party/upload-party-images',
    scanPartyQR: 'party/scan-qr',
    addInterest: 'party/add-interest',
    removePartyImg: 'party/remove-party-image',
    leaveParty: 'party/user-cancel-party',
    cancleParty: 'party/cancel-party',

    //setting API
    blockList: 'user/block-list',
    unblockUser: 'user/un-block-user',
    notification: 'user/user-setting',
    deleteAccount: 'user/delete-account',
    getPaid: 'user/get-paid',
    getPaymentHistory: 'user/user-payment-history',
    createCard: 'payment/create-card',
    cardList: 'payment/card-list',
    deleteCard: 'payment/delete-card',
    makePayment: 'payment/make-payment',

    //notification
    notificationList: 'notification/list',
    acceptFriendRequest: 'user/accept-friend-request',
    cancelFriendRequest: 'user/cancel-friend-request',
    acceptPartyRequest: 'party/accept-party-request',
    cancelPartyRequest: 'party/cancel-party-request',
    acceptPartyInvitaton: 'party/join-party',
    removeAllNotification: 'notification/remove-all',
    deleteNotification: 'notification/delete-notification',
    userUploadChat: 'user/upload-chat',

    // chat
    chatList: 'user/chat-list',

    // story
    userStoryList: 'user/story-list',
    userAddStory: 'user/add-story',
    userStory: 'user/user-story',
  },

  geolocationOptions: {
    enableHighAccuracy: false,
    timeout: 50000,
    maximumAge: 10000,
    distanceFilter: 1,
  },
  geoOptionHighAccurate: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 10000,
    distanceFilter: 1,
  },
};

export default BaseSetting;
