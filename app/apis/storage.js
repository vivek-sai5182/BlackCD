import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYLISTS_KEY = 'playlists';
const RECENT_KEY = 'recentlyPlayed';

// ─── Playlists ───────────────────────────────────────

export async function getPlaylists() {
  try {
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('getPlaylists error:', e.message);
    return [];
  }
}

export async function createPlaylist(name) {
  try {
    const playlists = await getPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: [],
    };
    playlists.push(newPlaylist);
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    return newPlaylist;
  } catch (e) {
    console.log('createPlaylist error:', e.message);
  }
}

export async function renamePlaylist(id, newName) {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.map(p =>
      p.id === id ? { ...p, name: newName } : p
    );
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('renamePlaylist error:', e.message);
  }
}

export async function deletePlaylist(id) {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.filter(p => p.id !== id);
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('deletePlaylist error:', e.message);
  }
}

export async function addSongToPlaylist(playlistId, song) {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.map(p => {
      if (p.id !== playlistId) return p;
      // avoid duplicates
      const already = p.songs.find(s => s.videoId === song.videoId);
      if (already) return p;
      return { ...p, songs: [...p.songs, song] };
    });
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('addSongToPlaylist error:', e.message);
  }
}

export async function removeSongFromPlaylist(playlistId, videoId) {
  try {
    const playlists = await getPlaylists();
    const updated = playlists.map(p => {
      if (p.id !== playlistId) return p;
      return { ...p, songs: p.songs.filter(s => s.videoId !== videoId) };
    });
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log('removeSongFromPlaylist error:', e.message);
  }
}

// ─── Recently Played ─────────────────────────────────

export async function getRecentlyPlayed() {
  try {
    const data = await AsyncStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log('getRecentlyPlayed error:', e.message);
    return [];
  }
}

export async function addToRecentlyPlayed(song) {
  try {
    let recent = await getRecentlyPlayed();
    // remove if already exists
    recent = recent.filter(s => s.videoId !== song.videoId);
    // add to front
    recent.unshift(song);
    // keep max 20
    if (recent.length > 20) recent = recent.slice(0, 20);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (e) {
    console.log('addToRecentlyPlayed error:', e.message);
  }
}
export async function removeFromRecentlyPlayed(videoId) {
  try {
    let recent = await getRecentlyPlayed();
    recent = recent.filter(s => s.videoId !== videoId);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (e) {
    console.log('removeFromRecentlyPlayed error:', e.message);
  }
}