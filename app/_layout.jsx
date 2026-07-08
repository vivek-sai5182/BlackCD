import { Stack } from 'expo-router';
import { AudioProvider } from './context/AudioContext';
import TrackPlayer from 'react-native-track-player';
import service from './service';
TrackPlayer.registerPlaybackService(() => service);
const RootLayout = () => {
  return (
    <AudioProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="components/songScreen" />
        <Stack.Screen name="components/playlistScreen" />
      </Stack>
    </AudioProvider>
  );
};

export default RootLayout;