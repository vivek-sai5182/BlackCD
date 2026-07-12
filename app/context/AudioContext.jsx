import TrackPlayer, {
  Capability,
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from "@javascriptcommon/react-native-track-player";
import { createContext, useContext, useEffect, useState } from "react";
import { isCached, saveToCache } from "../apis/cacher";
import { addToRecentlyPlayed } from "../apis/storage";
import { getUrl } from "../apis/ytsapi";

const AudioContext = createContext(null);

// Setup track player once
let isSetup = false;
async function setupPlayer() {
  if (isSetup) return;
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });
  isSetup = true;
}

export function AudioProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const progress = useProgress();

  useEffect(() => {
    setupPlayer();
  }, []);

  // Listen to player state changes
  useTrackPlayerEvents([Event.PlaybackState], (event) => {
    if (event.state === State.Playing) setIsPlaying(true);
    if (event.state === State.Paused) setIsPlaying(false);
    if (event.state === State.Stopped) setIsPlaying(false);
    if (event.state === State.Buffering) setIsLoading(true);
    if (event.state === State.Ready) setIsLoading(false);
  });

  // Auto play next when song ends
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
    await playNext();
  });

  async function playSong(song, songQueue = [], index = -1) {
    setQueue(songQueue);
    setQueueIndex(index);

    try {
      setCurrentSong(song);
      setIsLoading(true);

      // Check cache first
      let audioUri = await isCached(song.vid);

      if (audioUri) {
        console.log("Playing from cache:", song.vid);
      } else {
        const result = await getUrl(song.vid);
        if (!result) {
          console.log("No URL found");
          setIsLoading(false);
          return;
        }

        audioUri = result.url;

        // Cache in background
        saveToCache(song.vid, audioUri).then(() => {
          console.log("Background cache done:", song.vid);
        });
      }

      // Reset and add track to player
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.vid,
        url: audioUri,
        title: song.name,
        artist: "",
        artwork: song.thumbnail,
      });
      await TrackPlayer.play();

      setIsLoading(false);
      setIsPlaying(true);

      await addToRecentlyPlayed({
        videoId: song.vid,
        title: song.name,
        thumbnail: song.thumbnail,
      });
    } catch (e) {
      console.log("playSong error:", e.message);
      setIsLoading(false);
    }
  }

  async function togglePlayPause() {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  async function seekTo(millis) {
    await TrackPlayer.seekTo(millis / 1000); // TrackPlayer uses seconds
  }

  async function playNext() {
    if (queue.length === 0 || queueIndex === -1) return;
    const nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) return;
    const next = queue[nextIndex];
    await playSong(
      { vid: next.videoId, name: next.title, thumbnail: next.thumbnail },
      queue,
      nextIndex,
    );
  }

  async function playPrev() {
    if (queue.length === 0 || queueIndex === -1) return;
    const prevIndex = queueIndex - 1;
    if (prevIndex < 0) return;
    const prev = queue[prevIndex];
    await playSong(
      { vid: prev.videoId, name: prev.title, thumbnail: prev.thumbnail },
      queue,
      prevIndex,
    );
  }

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        isLoading,
        position: progress.position * 1000, // convert to ms
        duration: progress.duration * 1000, // convert to ms
        queue,
        queueIndex,
        playSong,
        togglePlayPause,
        seekTo,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
