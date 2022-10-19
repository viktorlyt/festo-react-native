import React from 'react';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk-next';
//import auth from '@react-native-firebase/auth';

/**
 * @class FacebookServices
 */
class FacebookServices {
  constructor() {
    this.requestManager = new GraphRequestManager();
  }
  /**
   *
   * @function  makeLoginButton
   */
  makeLoginButton(callback) {
    return (
      <LoginButton
        readPermissions={['public_profile']}
        onLoginFinished={(error, result) => {
          if (error) {
          } else if (result.isCancelled) {
          } else {
            AccessToken.getCurrentAccessToken()
              .then(async (data) => {
                await LoginManager.logOut();
                callback(data.accessToken);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }}
        onLogoutFinished={LoginManager.logOut()}
      />
    );
  }
  /**
   *
   * @function makeLogoutButton
   */
  makeLogoutButton(callback) {
    return (
      <LoginButton
        onLogoutFinished={() => {
          callback();
        }}
      />
    );
  }
  /**
   * @function customFacebookLogout
   */
  customFacebookLogout = () => {
    var current_access_token = '';
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        current_access_token = data.accessToken.toString();
      })
      .then(() => {
        let logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /**
   *
   * @function  loginToFacebook
   */
  loginToFacebook(callback) {
    LoginManager.logInWithPermissions([
      'email',
      'public_profile' /*'user_friends'*/,
    ]).then(
      function (result) {
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          console.log('FB Login Result', result);
          // alert('Login was successful with permissions: '
          // + result.grantedPermissions.toString());
          AccessToken.getCurrentAccessToken().then(async (data) => {
            customFacebookLogout();
            //console.log(data);
            callback(data);
            //alert(data.accessToken.toString())
          });
        }
      },
      function (error) {
        //callback(error)
        alert('Login failed with error: ' + error);
      },
    );
  }
  /**
   * @function logout
   */
  logout() {
    LoginManager.logOut();
  }

  initUser(token) {
    console.log('loadData2()>>>', token);
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' +
        token,
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        // Some user object has been set up somewhere, build that user here
        //   user.name = json.name
        //   user.id = json.id
        //   user.user_friends = json.friends
        //   user.email = json.email
        //   user.username = json.name
        //   user.loading = false
        //   user.loggedIn = true
        //   user.avatar = setAvatar(json.id)
        //   return user
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK');
      });
  }
  /**
   *
   * @function fetchProfile
   */
  async fetchProfile() {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me?fields=name,email,picture.type(large)',
        null,
        (error, result) => {
          if (result) {
            const profile = result;
            //  profile.email
            console.log('profile', profile);
            // profile.avatar = `https://graph.facebook.com/${result.id}/picture?type=large`
            resolve(profile);
          } else {
            reject(error);
          }
        },
      );

      new GraphRequestManager().addRequest(request).start();
    });
  }

  // async fetchProfile(accessToken) {
  //     return new Promise((resolve, reject) => {
  //         const facebookFirebaseCredential = auth.FacebookAuthProvider.credential(accessToken);
  //         auth().signInWithCredential(facebookFirebaseCredential);
  //         auth().onAuthStateChanged((user) => {
  //             if (user != null) {
  //                 resolve(user)
  //                 console.log(user)
  //             }else{
  //                 reject(error)
  //             }
  //         })
  //     })
  // }
}
/**
 * @function customFacebookLogout
 */
const customFacebookLogout = () => {
  var current_access_token = '';
  AccessToken.getCurrentAccessToken()
    .then((data) => {
      current_access_token = data.accessToken.toString();
    })
    .then(() => {
      let logout = new GraphRequest(
        'me/permissions/',
        {
          accessToken: current_access_token,
          httpMethod: 'DELETE',
        },
        (error, result) => {
          if (error) {
            console.log('Error fetching data: ' + error.toString());
          } else {
            LoginManager.logOut();
          }
        },
      );
      new GraphRequestManager().addRequest(logout).start();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const facebookService = new FacebookServices();
