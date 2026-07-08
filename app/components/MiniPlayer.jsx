import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { Colors } from '../constants/colors';

const MiniPlayer = () => {
  const { currentSong, isPlaying, isLoading, togglePlayPause } = useAudio();
  const router = useRouter();

  if (!currentSong) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: '/components/songScreen',
          params: {
            name: currentSong.name,
            thumbnail: currentSong.thumbnail,
            vid: currentSong.vid,
          },
        })
      }
    >
      <Image source={{ uri: currentSong.thumbnail }} style={styles.thumbnail} />

      <Text style={styles.title} numberOfLines={1}>
        {currentSong.name}
      </Text>

      <Pressable onPress={(e) => { e.stopPropagation(); togglePlayPause(); }} style={styles.btn}>
        <Ionicons
          name={isLoading ? 'hourglass' : isPlaying ? 'pause' : 'play'}
          size={26}
          color={Colors.red}
        />
      </Pressable>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          router.push({
            pathname: '/components/songScreen',
            params: {
              name: currentSong.name,
              thumbnail: currentSong.thumbnail,
              vid: currentSong.vid,
            },
          });
        }}
        style={styles.btn}
      >
        <Ionicons name="chevron-up" size={26} color="white" />
      </Pressable>
    </Pressable>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // height of tab bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rbgc,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    zIndex: 999,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },
  btn: {
    padding: 6,
  },
});