import { StyleSheet, Text, View, Image, Pressable, Modal, FlatList } from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { getPlaylists, addSongToPlaylist } from '../apis/storage';
import { useAudio } from '../context/AudioContext';
import { useRouter } from 'expo-router';

const ScreenSong = ({ thumbnail, name, vid }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const { playSong } = useAudio();
  const router = useRouter();

  async function handleLongPress() {
    const data = await getPlaylists();
    setPlaylists(data);
    setModalVisible(true);
  }

  async function handlePlay() {
    await playSong({ vid, name, thumbnail }, [], -1);
    router.push({
      pathname: '/components/songScreen',
      params: { name, thumbnail, vid },
    });
  }

  async function handleAddToPlaylist(playlistId) {
    await addSongToPlaylist(playlistId, {
      videoId: vid,
      title: name,
      thumbnail,
    });
    setModalVisible(false);
  }

  return (
    <View>
      <Pressable onLongPress={handleLongPress}>
        <View style={styles.song}>
          <Image
            source={{ uri: thumbnail }}
            resizeMode="cover"
            style={styles.tnail}
          />
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Pressable onPress={handlePlay} style={styles.playbtn}>
            <Ionicons name="play-circle" size={30} color={Colors.red} />
          </Pressable>
        </View>
      </Pressable>

      {/* Add to Playlist Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.playlistRow}
                  onPress={() => handleAddToPlaylist(item.id)}
                >
                  <Ionicons name="musical-notes" size={20} color={Colors.red} />
                  <Text style={styles.playlistName}>{item.name}</Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>No playlists yet. Create one in Profile!</Text>
              }
            />
            <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScreenSong;

const styles = StyleSheet.create({
  song: {
    width: 340,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rbgc,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 10,
    padding: 7,
    marginTop: 15,
  },
  text: {
    flex: 1,
    margin: 10,
    color: Colors.text,
  },
  tnail: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  playbtn: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: Colors.rbgc,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.red,
    maxHeight: '60%',
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgc,
  },
  playlistName: {
    color: Colors.text,
    fontSize: 15,
  },
  empty: {
    color: 'gray',
    textAlign: 'center',
    marginVertical: 20,
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: 'gray',
    fontSize: 15,
  },
});