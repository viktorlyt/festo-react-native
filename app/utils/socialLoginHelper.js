import BaseSetting from '@config/setting';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: BaseSetting.googleLoginClientId,
  offlineAccess: true,
  forceConsentPrompt: true,
});

export const signInWithGoogle = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      resolve(userInfo);
    } catch (error) {
      reject(error);
    }
  });
};

export const signOutGoogle = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      return;
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  });
};

export const googleSignOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    let response = await GoogleSignin.signOut();
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
