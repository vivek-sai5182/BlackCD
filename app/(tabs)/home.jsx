import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Colors } from '../constants/colors';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getRecentlyPlayed } from '../apis/storage';
import ScreenSong from '../components/screenSong';

const Home = () => {
  const [recentSongs, setRecentSongs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [])
  );

  async function loadRecent() {
    const data = await getRecentlyPlayed();
    setRecentSongs(data);
  }

  return (
    <View style={styles.view}>
      <Text style={styles.greeting}>Hi Vivek 👋</Text>
      <Text style={styles.heading}>Recently Played</Text>

      <FlatList
        data={recentSongs}
        keyExtractor={(item) => item.videoId}
        renderItem={({ item }) => (
          <ScreenSong
            thumbnail={item.thumbnail}
            name={item.title}
            vid={item.videoId}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No recently played songs yet.{'\n'}Search and play something! 🎵</Text>
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: Colors.bgc,
    paddingHorizontal: 20,
  },
  greeting: {
    color: Colors.text,
    fontSize: 32,
    marginTop: 60,
    marginBottom: 40,
    fontWeight: '600',
  },
  heading: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
  },
  empty: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 80,
    fontSize: 14,
    lineHeight: 24,
  },
});