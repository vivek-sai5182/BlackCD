import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { Colors } from "../constants/colors";
import { useAudio } from "../context/AudioContext";

const SongScreen = () => {
  const { name, thumbnail, vid } = useLocalSearchParams();
  const router = useRouter();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { currentSong, isPlaying, isLoading, position, duration, togglePlayPause, seekTo, playSong, playNext, playPrev } = useAudio();
  
  // // If this song isn't already playing, start it
  // useEffect(() => {
  //   if (!currentSong || currentSong.vid !== vid) {
  //     playSong({ vid, name, thumbnail });
  //   }
  // }, [vid]);

  // Rotating animation
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
    }
  }, [isPlaying]);

  function formatTime(ms) {
    if (!ms) return "0:00";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  // Seekable progress bar
  const progressBarWidth = useRef(0);
  

  const displaySong = currentSong || { name, thumbnail };

  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>
      </View>

      {/* Artwork */}
      <View style={styles.artCard}>
        <Animated.Image
          source={{ uri: displaySong.thumbnail }}
          style={[
            styles.artwork,
            {
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {displaySong.name}
      </Text>

      {/* Loading */}
      {isLoading && (
        <Text style={styles.loading}>Loading audio...</Text>
      )}

      {/* Progress bar - tap or drag to seek */}
      <View style={styles.progressWrap}>
        <View
          style={styles.progressBar}
          onLayout={(e) => { progressBarWidth.current = e.nativeEvent.layout.width; }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            const x = e.nativeEvent.locationX;
            const ratio = Math.max(0, Math.min(1, x / progressBarWidth.current));
            seekTo(ratio * duration);
          }}
          onResponderMove={(e) => {
            const x = e.nativeEvent.locationX;
            const ratio = Math.max(0, Math.min(1, x / progressBarWidth.current));
            seekTo(ratio * duration);
          }}
        >
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Ionicons name="repeat" size={22} color="gray" />
        
        <Pressable onPress={playPrev}>
          <Ionicons name="play-skip-back" size={36} color="white" />
        </Pressable>

        <Pressable style={styles.playBtn} onPress={togglePlayPause}>
          <Ionicons
            name={isLoading ? "hourglass" : isPlaying ? "pause" : "play"}
            size={36}
            color="black"
          />
        </Pressable>

        <Pressable onPress={playNext}>
          <Ionicons name="play-skip-forward" size={36} color="white" />
        </Pressable>

        <Ionicons name="shuffle" size={22} color="gray" />
      </View>

    </View>
  );
};

export default SongScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 30,
  },
  artCard: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#000",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 50,
  },
  loading: {
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  progressWrap: {
    marginBottom: 30,
  },
  progressBar: {
    height: 14,
    backgroundColor: "#333",
    borderRadius: 7,
    marginTop: 50,
    justifyContent: 'center',
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.red,
    borderRadius: 7,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  time: {
    color: "#aaa",
    fontSize: 11,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});