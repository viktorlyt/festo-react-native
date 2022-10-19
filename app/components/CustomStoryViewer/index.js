import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal } from 'react-native';
import { isArray } from 'lodash';
import StoryContainer from '../../libs/react-native-stories-media/src/StoryContainer';
import styles from './styles';
import { useSelector } from 'react-redux';

const { CubeNavigationHorizontal } = require('react-native-3dcube-navigation');

/**
 * Module CustomStoryViewer for custom story for single user
 * @module CustomStoryViewer
 *
 */
function CustomStoryViewer(props, ref) {
  const { data = [], navigation } = props;
  const { userData } = useSelector((state) => state.auth);

  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  // this function for share function to call on another page
  useImperativeHandle(ref, () => ({
    handleStory: () => {
      onStorySelect();
    },
  }));

  // this function for set initial index and show story view
  const onStorySelect = () => {
    setCurrentUserIndex(0);
    setModel(true);
  };

  // this function for close story
  const onStoryClose = () => {
    setModel(false);
  };

  // this function for next story view
  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex + 1;
    if (data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        // error here
        try {
          modalScroll.current.scrollTo(newIndex, true);
        } catch (e) {
          console.warn('error=>', e);
        }
      }
    } else {
      setModel(false);
    }
  };

  // this function for previous story view
  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  // this function for handle scroll after change story
  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious(false);
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModelOpen}
      style={styles.modal}
      onShow={() => {
        if (currentUserIndex > 0) {
          modalScroll.current.scrollTo(currentUserIndex, false);
        }
      }}
      onRequestClose={onStoryClose}>
      <CubeNavigationHorizontal
        callBackAfterSwipe={(g) => onScrollChange(g)}
        ref={modalScroll}
        style={styles.container}>
        {isArray(data) &&
          data.length > 0 &&
          data.map((item, index) => (
            <StoryContainer
              key={item.title}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              dataStories={item}
              isNewStory={index !== currentUserIndex}
              textReadMore={props.textReadMore}
              handleModal={(id) => {
                console.log('id ===>>', id);
                if (userData?.id !== id) {
                  setModel(false);
                  navigation.push('Profile', {
                    from: 'friends',
                    id: id,
                  });
                }
              }}
            />
          ))}
      </CubeNavigationHorizontal>
    </Modal>
  );
}

export default forwardRef(CustomStoryViewer);
