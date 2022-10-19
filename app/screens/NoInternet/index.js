import React, { Component } from 'react';
import { Dimensions, Modal, View } from 'react-native';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import { translate } from 'app/lang/Translate';
import { Images } from '@config';
import { Text } from '@components';
import styles from './styles';

/**
 * @class NoInternet
 */
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      cancelModal: false,
      cancelData: {},
    };
  }

  componentDidMount() {
    NetInfo.addEventListener((state) => {
      this.handleConnectivity(state);
    });
  }

  handleConnectivity(state) {
    if (state.isConnected) {
      this.setState({ open: false });
      console.log('Net Connected');
      // Alert.alert('connected to interntet');
      this.props.onConnect();
    } else {
      this.setState({ open: true });
      console.log('Net Disconnected');
    }
  }

  onTryAgainPress = () => {
    console.log('OnTryAgainPress()');
    NetInfo.fetch().then((netWork) => {
      this.handleConnectivity(netWork);
    });
  };

  render() {
    const { imageStyle } = this.props;

    return (
      <>
        <Modal transparent animationType="slide" visible={this.state.open}>
          <View style={styles.mainViewModal}>
            <View style={styles.containerf}>
              <LottieView
                ref={(animation) => {
                  this.animation1 = animation;
                }}
                autoSize={false}
                style={[styles.animation, imageStyle]}
                source={Images.noInternet}
                autoPlay={true}
                loop={true}
              />
              <View
                style={{
                  marginTop: 10,
                }}>
                <Text bold style={styles.offlineTitle}>
                  {translate('Oops')}!
                </Text>
                <View
                  style={{
                    paddingVertical: 10,
                  }}>
                  <Text bold style={styles.offlineSubtxt}>
                    {translate('noInternet')}
                  </Text>
                  <Text bold style={styles.offlineSubtxt}>
                    {translate('message')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

index.propTypes = {
  msgNoData: PropTypes.string,
  imageSource: PropTypes.any,
  style: PropTypes.object,
  onAnimationFinish: PropTypes.func,
  offlineModalOpen: PropTypes.bool,
  onConnect: PropTypes.func,
};

index.defaultProps = {
  msgNoData: '',
  imageSource: null,
  style: {},
  offlineModalOpen: false,
  onAnimationFinish: () => {},
  onConnect: () => {},
};

export default index;
