import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

let sound = null;

export async function playAndCache(streamUrl, fileName) {
  try {
    // 1. Stop old sound if any
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }

    // 2. Start streaming immediately
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: streamUrl },
      { shouldPlay: true }
    );

    sound = newSound;

    // 3. Start background download (no await)
    const localPath = FileSystem.documentDirectory + fileName;

    FileSystem.downloadAsync(streamUrl, localPath)
      .then(() => {
        console.log("Downloaded to:", localPath);
      })
      .catch((err) => {
        console.log("Download failed:", err.message);
      });

  } catch (err) {
    console.log("Playback error:", err.message);
  }
}

export async function stop() {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }
}
