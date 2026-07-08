import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Colors } from '../constants/colors';
import { getPlaylists, removeSongFromPlaylist, getRecentlyPlayed,removeFromRecentlyPlayed } from '../apis/storage';
import { useAudio } from '../context/AudioContext';

const PlaylistScreen = () => {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [songs, setSongs] = useState([]);
  const { playSong } = useAudio();

  useFocusEffect(
    useCallback(() => {
      loadSongs();
    }, [])
  );

    async function loadSongs() {
        if (id === 'recent') {
            const recent = await getRecentlyPlayed();
            setSongs(recent);
            return;
        }
        const playlists = await getPlaylists();
        const playlist = playlists.find(p => p.id === id);
        if (playlist) setSongs(playlist.songs);
    }

  async function handleRemove(videoId, title) {
    Alert.alert(
      'Remove Song',
      `Remove "${title}" from this playlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (id === 'recent') {
              await removeFromRecentlyPlayed(videoId);
            } else {
              await removeSongFromPlaylist(id, videoId);
            }
            loadSongs();
          },
        },
      ]
    );
  }

  const renderSong = ({ item }) => (
    <View style={styles.songRow}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <Text style={styles.songTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Pressable
        onPress={() => {
          const index = songs.findIndex(s => s.videoId === item.videoId);
          playSong(
            { vid: item.videoId, name: item.title, thumbnail: item.thumbnail },
            songs,
            index
          );
          router.push({
            pathname: '/components/songScreen',
            params: { name: item.title, thumbnail: item.thumbnail, vid: item.videoId },
          });
        }}
        style={styles.iconBtn}
      >
        <Ionicons name="play-circle" size={30} color={Colors.red} />
      </Pressable>
      <Pressable onPress={() => handleRemove(item.videoId, item.title)} style={styles.iconBtn}>
        <Ionicons name="trash" size={22} color="gray" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>
        <Text style={styles.heading}>{name}</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.videoId}
        renderItem={renderSong}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No songs yet. Long press any song to add it here!
          </Text>
        }
      />
    </View>
  );
};

export default PlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgc,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 24,
  },
  heading: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rbgc,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.red,
    padding: 8,
    marginBottom: 12,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  songTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    marginHorizontal: 10,
  },
  iconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  empty: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
  },
});