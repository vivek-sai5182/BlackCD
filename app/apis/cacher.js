import * as FileSystem from 'expo-file-system/legacy';

const CACHE_DIR = FileSystem.documentDirectory + 'audioCache/';
const MAX_SONGS = 30;

async function ensureDir() {
  try {
    const dir = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dir.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  } catch (e) {
    console.log('ensureDir error:', e.message);
  }
}

function getCachePath(videoId) {
  return CACHE_DIR + videoId + '.mp3';
}

export async function isCached(videoId) {
  try {
    await ensureDir();
    const path = getCachePath(videoId);
    const info = await FileSystem.getInfoAsync(path);
    console.log('Cache check:', videoId, info.exists);
    return info.exists ? path : null;
  } catch (e) {
    console.log('isCached error:', e.message);
    return null;
  }
}

export async function saveToCache(videoId, streamUrl) {
  try {
    await ensureDir();
    await evictIfNeeded();
    const path = getCachePath(videoId);
    await FileSystem.downloadAsync(streamUrl, path);
    console.log('Cached:', videoId);
    return path;
  } catch (e) {
    console.log('Cache save error:', e.message);
    return null;
  }
}

async function evictIfNeeded() {
  try {
    await ensureDir();
    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
    if (files.length < MAX_SONGS) return;

    const fileInfos = await Promise.all(
      files.map(async (f) => {
        const info = await FileSystem.getInfoAsync(CACHE_DIR + f);
        return { name: f, modTime: info.modificationTime || 0 };
      })
    );

    fileInfos.sort((a, b) => a.modTime - b.modTime);
    const toDelete = fileInfos.slice(0, 5);
    for (const f of toDelete) {
      await FileSystem.deleteAsync(CACHE_DIR + f.name, { idempotent: true });
      console.log('Evicted:', f.name);
    }
  } catch (e) {
    console.log('Evict error:', e.message);
  }
}