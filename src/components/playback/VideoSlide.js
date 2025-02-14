import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Video } from 'expo-av';
import { useColors } from '@/context/ColorSchemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 15000; // 15 seconds

export function VideoSlide({ videoSource }) {
  const video = useRef(null);
  const colors = useColors();
  const [videoDuration, setVideoDuration] = useState(null);
  const [showBlackFrame, setShowBlackFrame] = useState(false);

  // Special handling for slide 1 which needs to show full width
  const isSlide1 = videoSource === require('@/../assets/playback-vids/slide1.MP4');
  const isSlide5 = videoSource === require('@/../assets/playback-vids/slide5.MP4');

  useEffect(() => {
    let videoEndTimeout;
    let blackFrameTimeout;

    async function handleVideo() {
      if (video.current) {
        try {
          // Load the video and get its duration
          const status = await video.current.loadAsync(videoSource, {}, false);
          const duration = status.durationMillis || 0;
          setVideoDuration(duration);

          // Start playing the video
          await video.current.playAsync();

          // If video is shorter than 15 seconds, handle the ending
          if (duration < STORY_DURATION) {
            if (isSlide5) {
              // For slide 5, let it play till the end then show black frame
              blackFrameTimeout = setTimeout(() => {
                setShowBlackFrame(true);
              }, duration);
            } else {
              // For other slides, pause slightly before end
              videoEndTimeout = setTimeout(() => {
                if (video.current) {
                  video.current.pauseAsync();
                }
              }, duration - 50);
            }
          }
        } catch (error) {
          console.error('Error loading video:', error);
        }
      }
    }

    handleVideo();

    return () => {
      if (videoEndTimeout) clearTimeout(videoEndTimeout);
      if (blackFrameTimeout) clearTimeout(blackFrameTimeout);
      if (video.current) {
        video.current.unloadAsync();
      }
    };
  }, [videoSource, isSlide5]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={videoSource}
        style={[styles.video, showBlackFrame && styles.hidden]}
        resizeMode={isSlide1 ? 'contain' : 'cover'}
        isLooping={false}
        shouldPlay
        isMuted={false}
        onPlaybackStatusUpdate={(status) => {
          // Handle video end
          if (status.didJustFinish && videoDuration < STORY_DURATION) {
            if (!isSlide5) {
              video.current?.pauseAsync();
            }
          }
        }}
      />
      {showBlackFrame && <View style={styles.blackFrame} />}
      <View style={[styles.overlay, { backgroundColor: colors.backgroundTransparent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  blackFrame: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  hidden: {
    opacity: 0,
  },
});
