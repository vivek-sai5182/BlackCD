import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getPlaylists, createPlaylist, renamePlaylist, deletePlaylist, getRecentlyPlayed } from '../apis/storage';
import { useRouter } from 'expo-router';

const Profile = () => {
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [inputName, setInputName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [recentSongs, setRecentSongs] = useState([]);
  const router = useRouter();

  // Reload playlists every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadPlaylists();
    }, [])
  );

  async function loadPlaylists() {
  const data = await getPlaylists();
  const recent = await getRecentlyPlayed();
  setPlaylists(data);
  setRecentSongs(recent);
}

  async function handleCreate() {
    if (inputName.trim().length === 0) return;
    await createPlaylist(inputName.trim());
    setInputName('');
    setModalVisible(false);
    loadPlaylists();
  }

  async function handleRename() {
    if (inputName.trim().length === 0) return;
    await renamePlaylist(selectedPlaylist.id, inputName.trim());
    setInputName('');
    setRenameModal(false);
    setSelectedPlaylist(null);
    loadPlaylists();
  }

  async function handleDelete(playlist) {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePlaylist(playlist.id);
            loadPlaylists();
          },
        },
      ]
    );
  }

  function openRenameModal(playlist) {
    setSelectedPlaylist(playlist);
    setInputName(playlist.name);
    setRenameModal(true);
  }

  function openPlaylist(playlist) {
    router.push({
      pathname: '/components/playlistScreen',
      params: { id: playlist.id, name: playlist.name },
    });
  }

  const renderPlaylist = ({ item }) => (
    <Pressable style={styles.playlistRow} onPress={() => openPlaylist(item)}>
      <View style={styles.playlistIcon}>
        <Ionicons name="musical-notes" size={24} color={Colors.red} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.songCount}>{item.songs.length} songs</Text>
      </View>
      <Pressable onPress={() => openRenameModal(item)} style={styles.iconBtn}>
        <Ionicons name="pencil" size={20} color="gray" />
      </Pressable>
      <Pressable onPress={() => handleDelete(item)} style={styles.iconBtn}>
        <Ionicons name="trash" size={20} color={Colors.red} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.view}>
      {/* Header */}
      <Text style={styles.name}>My Music</Text>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Your Playlists</Text>
        <Pressable onPress={() => { setInputName(''); setModalVisible(true); }} style={styles.addBtn}>
          <Ionicons name="add-circle" size={32} color={Colors.red} />
        </Pressable>
      </View>
      {/* Recently Played */}
      {recentSongs.length > 0 && (
        <Pressable
          style={styles.playlistRow}
          onPress={() => router.push({
            pathname: '/components/playlistScreen',
            params: { id: 'recent', name: 'Recently Played' },
          })}
        >
          <View style={styles.playlistIcon}>
            <Ionicons name="time" size={24} color={Colors.red} />
          </View>
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>Recently Played</Text>
            <Text style={styles.songCount}>{recentSongs.length} songs</Text>
          </View>
        </Pressable>
      )}
      {/* Playlists */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylist}
        ListEmptyComponent={
          <Text style={styles.empty}>No playlists yet. Tap + to create one!</Text>
        }
      />

      {/* Create Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Playlist name..."
              placeholderTextColor="gray"
              value={inputName}
              onChangeText={setInputName}
            />
            <View style={styles.modalBtns}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreate} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Modal */}
      <Modal visible={renameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Rename Playlist</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="New name..."
              placeholderTextColor="gray"
              value={inputName}
              onChangeText={setInputName}
            />
            <View style={styles.modalBtns}>
              <Pressable onPress={() => setRenameModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleRename} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Rename</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: Colors.bgc,
    paddingHorizontal: 20,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 60,
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  heading: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: 'bold',
  },
  addBtn: {
    padding: 4,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rbgc,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  playlistIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgc,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  songCount: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2,
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4,
  },
  empty: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
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
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: Colors.bgc,
    color: Colors.text,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    padding: 10,
  },
  cancelText: {
    color: 'gray',
    fontSize: 15,
  },
  confirmBtn: {
    backgroundColor: Colors.red,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});