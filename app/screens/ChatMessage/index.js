import React, { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { isArray, isEmpty, isObject, isString, toNumber } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { useIsFocused } from '@react-navigation/native';
import { GiftedChat, Day } from '../../libs/react-native-gifted-chat';
import { AlertModal, Header, TextInput } from '@components';
import SocketAction from '@redux/reducers/Socket/actions';
import { renderBubble } from './RenderBubble';
import { CustomIcon } from '@config/LoadIcons';
import { BaseColors } from '@config/theme';
import ImagePicker from '../../libs/react-native-image-crop-picker';
import Popover from 'react-native-popover-view';
import authActions from '@redux/reducers/auth/actions';
import { getApiDataProgress, getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import ViewImageModal from './ViewImageModal';
import styles from './styles';

/**
 * Module   ChatMessage
 * @module   ChatMessage
 *
 */
export default function ChatMessage({ navigation, route }) {
  const chatData = route?.params?.userChat;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { setActiveScreen, setActiveChatUser } = authActions;
  const IOS = Platform.OS === 'ios';
  const { userData, accessToken } = useSelector((state) => state.auth);
  const socketObj = useSelector((state) => state.socket.socketObj);
  const chatDataValue = useSelector((state) => state.socket.chatData);
  const [messages, setMsg] = useState([]);
  const [textMessage, SetTextInputMessage] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState({
    visible: false,
    message: '',
    loader: false,
    type: '',
  });
  const [pageLoad, setPageLoad] = useState(true);

  const [state, setState] = useState({
    loadEarlier: false,
    isLoadingEarlier: false,
    page: 0,
  });
  const [imageModal, setImageModal] = useState({ visible: false, url: '' });
  const [uploadLoader, setUploadLoader] = useState(false);

  const optionsArray = [
    {
      id: 1,
      optionLabel: 'Delete chat',
      handleClick: () => onDeleteChat(),
      iconName: '',
    },
    {
      id: 2,
      optionLabel: 'Block User',
      handleClick: () => onBlockUser(),
      iconName: '',
    },
  ];

  // this function for delete chat conversation
  const onDeleteChat = () => {
    setTimeout(() => {
      setConfirmAlert({
        visible: true,
        message: 'Are you sure you want to delete this conversation?',
        type: 'delete',
      });
    }, 500);
  };

  const onBlockUser = () => {
    console.log('block user =====>>>> ');
    setTimeout(() => {
      setConfirmAlert({
        visible: true,
        message: `Are you sure you want to block ${chatData?.username || ''}?`,
        type: 'block',
      });
    }, 500);
  };

  const { emit } = SocketAction;
  let isTypingInput = false;
  let stopTypingTimeout = false;

  useEffect(() => {
    if (!isEmpty(socketObj)) {
      getConversion('');
    } else {
      setPageLoad(false);
    }
  }, [chatDataValue]);

  useEffect(() => {
    if (isFocused) {
      if (!isEmpty(socketObj)) {
        const id =
          userData?.id === chatData?.owner_id
            ? chatData?.user_id
            : chatData?.owner_id;
        socketObj &&
          socketObj.emit(
            'messageReadAll',
            { cid: chatData.id, sid: id },
            (v) => {},
          );
      }
    }
  }, [socketObj, isFocused, chatDataValue]);

  useEffect(() => {
    const id =
      userData?.id === chatData?.owner_id
        ? chatData?.user_id
        : chatData?.owner_id;
    dispatch(setActiveScreen('chat'));
    dispatch(setActiveChatUser(id));
  }, []);

  // this function for delete chat conversation
  function deleteChat() {
    socketObj.emit('deleteConversation', { conv_id: chatData.id }, (v) => {
      setConfirmAlert({
        visible: false,
        message: '',
        loader: false,
        type: '',
      });
      if (!isEmpty(socketObj)) {
        navigation.goBack();
      }
    });
  }

  // this function for block user
  async function blockUser() {
    const id =
      userData?.id === chatData?.owner_id
        ? chatData?.user_id
        : chatData?.owner_id;

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.BlockUser}?uid2=${id}`,
        'GET',
      );

      if (response.status) {
        setTimeout(() => {
          setConfirmAlert({
            visible: false,
            message: '',
            loader: false,
            type: '',
          });
          navigation.goBack();
        }, 1000);
      } else {
        setConfirmAlert({
          ...confirmAlert,
          loader: false,
        });
      }
      Toast.show(response?.message);
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setConfirmAlert({
        ...confirmAlert,
        loader: false,
      });
    }
  }

  const getConversion = (type = '') => {
    if (type === 'load') {
      setState({
        ...state,
        isLoadingEarlier: true,
      });
    }

    const obj = {
      cid: chatData.id,
      page: type === 'initial' || type === '' ? 1 : state.page + 1,
    };

    socketObj &&
      socketObj.emit('getChat', obj, (v) => {
        const callBackData = v;
        if (isArray(callBackData) && !isEmpty(callBackData)) {
          const messagesArray = [];
          callBackData.map((item) => {
            messagesArray.push(parseConverationObject(item));
          });
          setState({
            ...state,
            isLoadingEarlier: false,
            loadEarlier: true,
            page: obj.page,
          });
          setPageLoad(false);
          const valueMessage = messagesArray;
          if (type === 'initial' || type === '') {
            setMsg(valueMessage);
          } else {
            setMsg([...valueMessage, ...messages]);
          }
        } else {
          setState({
            ...state,
            page: obj.page,
            isLoadingEarlier: false,
            loadEarlier: false,
          });
          setPageLoad(false);
        }
      });
  };

  const parseConverationObject = (convObj) => {
    const ndate = convObj.created_at * 1000;
    const messageData = {
      // avatar: convObj.avatar,
      // group_id: convObj.group_id,
      createdAt: ndate,
      id: convObj.id,
      _id: convObj.id,
      is_read: convObj.is_read,
      // logged_in_id: convObj.logged_in_id,
      message: convObj.message,
      sender_id: convObj.user_id,
      text: convObj.type !== 'text' ? '' : convObj.message,
      file: convObj.file_name,
      type: convObj.type,
      user: {
        _id: toNumber(userData.id) === toNumber(convObj.sender_id) ? 1 : 2,
        avatar:
          toNumber(userData.id) === toNumber(convObj.id) ? '' : convObj.photo,
      },
      ...parseConvObjType(convObj),
    };
    return messageData;
  };

  const parseConvObjType = (convObj) => {
    const msgObj = {};
    if (convObj.type === 'file') {
      const fileData = isObject(convObj.file_data)
        ? convObj.file_data
        : isString(convObj.file_data) && convObj.file_data !== ''
        ? JSON.parse(convObj.file_data)
        : '';
      if (isObject(fileData)) {
        if (fileData.type) {
          if (fileData.type.includes('image')) {
            msgObj.image = convObj.file_url;
          } else if (fileData.type.includes('video')) {
            msgObj.video = convObj.file_url;
          } else {
            msgObj.fileData = fileData;
            msgObj.file_url = convObj.file_url;
          }
        }
      } else if (
        isString(convObj.file_url) &&
        (convObj.file_url.includes('jpg') ||
          convObj.file_url.includes('jpeg') ||
          convObj.file_url.includes('png'))
      ) {
        msgObj.image = convObj.file_url;
      }
    }
    return msgObj;
  };

  const typing = (msgTxt, type) => {
    if (
      isString(accessToken) &&
      !isEmpty(accessToken) &&
      isObject(userData) &&
      !isEmpty(userData)
    ) {
      if (isString(type) && type === 'stop') {
        emit(
          'stopTypingEm',
          {
            recevierId: chatData.user_id,
            userid: chatData.powner_id,
            cid: chatData.id,
          },
          (callBackData) => {
            console.log('callBackData ==>>>', callBackData);
          },
        );
      } else {
        emit(
          'isTyping',
          {
            recevierId: chatData.user_id,
            userid: chatData.powner_id,
            cid: chatData.id,
          },
          (callBackData) => {
            console.log('callBackData ==>>>', callBackData);
          },
        );
      }
    }
  };

  const resetStopTypingTimeout = () => {
    if (stopTypingTimeout) {
      clearTimeout(stopTypingTimeout);
    }
    stopTypingTimeout = setTimeout(() => {
      isTypingInput = false;
      typing('', 'stop');
      stopTypingTimeout = undefined;
    }, 700);
  };

  const setInputMessage = (text) => {
    // setInputMessage(text);
    SetTextInputMessage(text);

    typing();

    if (isTypingInput === false) {
      console.log('isTypingInput ===>>>', isTypingInput);
      isTypingInput = true;
      typing('', 'start');
      // Start a 3 second countdown to see if they type within that window
      resetStopTypingTimeout();
    } else {
      typing('', 'start');
      // If the user typed another character, reset the timeout
      resetStopTypingTimeout();
    }
  };

  const onSend = (
    messageVal = [],
    type = 'text',
    file_url = '',
    file_data = '',
  ) => {
    console.log(
      'messages==>>>',
      chatData,
      userData,
      messageVal,
      type,
      file_url,
    );
    console.log('messages data ====', messageVal);
    const message =
      isArray(messageVal) &&
      !isEmpty(messageVal) &&
      isString(messageVal[0].text) &&
      !isEmpty(messageVal[0].text)
        ? messageVal[0].text
        : '';

    console.log('reponse data msg ===', messageVal);

    // /* Flag - To know if file uploaded? */
    let isFileUploaded = false;
    if (isObject(file_data) && file_data.uploaded) {
      isFileUploaded = true;
    }
    let data = {};

    console.log(
      '==================>>>',
      message,
      chatData.user_id,
      userData.id,
      // senderID: chatData.user_id,
      chatData.id,
      'text',
    );
    /* Send socket event only if type is text or file is uploaded */
    if (type === 'text' || type === 'img') {
      const id =
        userData?.id === chatData?.owner_id
          ? chatData?.user_id
          : chatData?.owner_id;

      if (message !== '' && message.trim().length !== 0) {
        data = {
          msg: message,
          recevierId: id,
          senderID: userData?.id,
          converId: chatData.id,
          type,
          image: '',
        };
      } else {
        data = {
          msg: messageVal,
          recevierId: id,
          senderID: userData.id,
          converId: chatData.id,
          type: 'file',
          file_type: 'file',
          image: '',
          filename: messageVal,
        };
      }
      socketObj && socketObj.emit('sendMessage', data, (v) => {});
      setInputMessage('');

      getConversion('initial');
    }
  };

  // function for openCamera
  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((img) => {
      console.log(img);
      const arr = [...messages];
      arr.push({
        msg: '',
        recevierId: chatData.user_id,
        senderID: userData.id,
        converId: chatData.id,
        load: true,
        type: 'file',
        file_type: 'file',
        image: '',
        filename: '',
        user: {
          _id: 1,
          avatar: '',
        },
      });
      setMsg(arr);
      uploadImage(img);
    });
  };

  // function for openGallery
  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      multiple: false,
    }).then((img) => {
      console.log(img);
      const arr = [...messages];
      arr.push({
        msg: '',
        recevierId: chatData.user_id,
        senderID: userData.id,
        converId: chatData.id,
        load: true,
        type: 'file',
        file_type: 'file',
        image: '',
        filename: '',
        user: {
          _id: 1,
          avatar: '',
        },
      });
      setMsg(arr);
      uploadImage(img);
    });
  };

  // this function upload image to server and get url
  async function uploadImage(imgData) {
    setUploadLoader(true);
    try {
      const imgFile = {
        uri: imgData?.path,
        name: imgData?.path.substr(imgData?.path.lastIndexOf('/') + 1),
        type: imgData.mime,
      };
      const obj = {
        'ImageForm[photo]': imgFile,
      };

      const response = await getApiDataProgress(
        BaseSetting.endpoints.userUploadChat,
        'POST',
        obj,
        { Authorization: `Bearer ${accessToken}` },
      );

      if (response.status) {
        onSend(response.data, 'img');
      } else {
        Toast.show(response?.message || 'Error to upload image on server.');
      }
      setUploadLoader(false);
    } catch (error) {
      setUploadLoader(false);
      console.log('image upload error ===>', error);
    }
  }

  const renderDay = (props) => (
    <Day {...props} textStyle={styles.dateTextStyle} dateFormat="DD MMM YYYY" />
  );

  const renderCustomView = (props) => {
    const {
      currentMessage: { file, type, load },
    } = props;
    // this function renders loader while sending image
    if (type !== 'text') {
      return (
        <View>
          {uploadLoader && load ? (
            <>
              <ActivityIndicator
                animating
                style={styles.msgImgStyle}
                size={26}
                color={BaseColors.primary}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setImageModal({ visible: true, url: file });
                }}>
                <Image source={{ uri: file }} style={styles.msgImgStyle} />
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    }
  };

  // this function for render empty view
  function renderEmptyView() {
    return (
      <View style={styles.emptyMsgContainer}>
        <Text>No conversation yet</Text>
      </View>
    );
  }

  // this function renders loader
  function renderLoader() {
    return (
      <View style={styles.emptyMsgContainer}>
        <ActivityIndicator size={30} color={BaseColors.primary} animating />
      </View>
    );
  }

  // RenderComposer fuction is the custom imput for the mesaage from Here.
  const renderComposer = (props) => {
    if (!chatData?.is_friend) {
      return (
        <View style={{ paddingVertical: 20, flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>
            You no longer friend with {chatData?.username || ''}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.inputMainView}>
        <Popover
          popoverStyle={{ borderRadius: 8 }}
          offset={IOS ? 0 : 25}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          from={
            <TouchableOpacity
              onPress={() => setShowPopover(true)}
              activeOpacity={0.8}
              style={styles.paperclipStyle}>
              <CustomIcon
                name="attach"
                size={20}
                color={BaseColors.blackColor}
              />
            </TouchableOpacity>
          }>
          {/* show model   */}
          <TouchableOpacity
            style={styles.modalRowView}
            onPress={() => {
              setShowPopover(false);
              setTimeout(() => {
                openCamera();
              }, 500);
            }}>
            <View style={{ flexDirection: 'row' }}>
              <CustomIcon
                name="camera-o"
                size={20}
                color={BaseColors.primary}
              />
              <Text style={styles.modelTxt}>Take Pic</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalRowView}
            onPress={() => {
              setShowPopover(false);
              setTimeout(() => {
                openGallery();
              }, 500);
            }}>
            <View style={{ flexDirection: 'row' }}>
              <CustomIcon name="gallery" size={20} color={BaseColors.primary} />
              <Text style={styles.modelTxt}>Upload Pic</Text>
            </View>
          </TouchableOpacity>
        </Popover>
        <View style={styles.msgInputViewStyle}>
          <TextInput
            // ref={lastNameRef}
            // onSubmit={() => {
            //   lastNameRef.current.focus();
            // }}
            value={textMessage}
            returnKeyType="next"
            onChange={(val) => SetTextInputMessage(val)}
            placeholderTextColor={'#4b4848'}
            placeholderText="Type message...."
            underlineColorAndroid="transparent"
            style={styles.msgInputStyle}
            inputStyle={{ height: 45 }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.msgSendViewStyle}
          onPress={
            !isEmpty(textMessage) &&
            textMessage.trim().length != '' &&
            !isEmpty(socketObj)
              ? () => {
                  const msgAry = [{ text: textMessage }];
                  onSend(msgAry);
                }
              : null
          }>
          <CustomIcon name="send" size={18} color={BaseColors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header
        title={chatData?.username || ''}
        leftIcon
        leftIconName="arrowleft"
        displayOptions
        optionsArray={optionsArray}
        image
        imageUrl={chatData?.user_image || chatData?.photo || ''}
        onBackPress={() => navigation.goBack()}
        onTitlePress={() => {
          const id =
            userData?.id === chatData?.owner_id
              ? chatData?.user_id
              : chatData?.owner_id;
          navigation.push('Profile', {
            from: 'friends',
            id: id,
          });
        }}
      />
      {pageLoad ? (
        renderLoader()
      ) : (
        <View style={{ flex: 1 }}>
          <GiftedChat
            renderDay={renderDay}
            renderBubble={renderBubble}
            // renderAvatar={renderAvatar}
            messages={messages}
            renderCustomView={renderCustomView}
            renderComposer={renderComposer}
            renderChatEmpty={renderEmptyView}
            onSend={(message) => {
              if (!isEmpty(socketObj)) {
                onSend(message, 'text');
              }
            }}
            user={{
              _id: 1,
              avatar: { uri: '' },
            }}
            wrapInSafeArea={false}
            inverted={false}
            loadEarlier={state.loadEarlier}
            onLoadEarlier={() => {
              if (!isEmpty(socketObj)) {
                getConversion('load');
              }
            }}
            isLoadingEarlier={state.isLoadingEarlier}
            scrollToBottom
            // renderAvatarOnTop
            // showAvatarForEveryMessage
            isCustomViewBottom
            minInputToolbarHeight={Dimensions.get('screen').width / 4.2}
            // disableComposer
            // loadEarlier={loadEarlier}
            // onLoadEarlier={this.onLoadEarlier}
            // isLoadingEarlier={isLoadingEarlier}
            // showUserAvatar
          />
        </View>
      )}
      {imageModal?.visible && (
        <ViewImageModal
          visible={imageModal.visible}
          handleModal={() => {
            setImageModal({ visible: false, url: '' });
          }}
          imgUrl={imageModal?.url}
        />
      )}
      {confirmAlert.visible && (
        <AlertModal
          title=" "
          loader={confirmAlert.loader}
          visible={confirmAlert.visible}
          setVisible={() =>
            setConfirmAlert({
              visible: false,
              message: '',
              loader: false,
              type: '',
            })
          }
          description={confirmAlert.message || ''}
          btnYPress={() => {
            if (!isEmpty(socketObj)) {
              setConfirmAlert({
                ...confirmAlert,
                loader: true,
              });
              if (confirmAlert.type === 'delete') {
                deleteChat();
              } else {
                blockUser();
              }
            }
          }}
          btnYTitle={'Confirm'}
          btnNTitle={'Cancel'}
        />
      )}
    </View>
  );
}
