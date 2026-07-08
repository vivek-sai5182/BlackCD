const fs = require('fs');
const path = require('path');

// Fix MusicService.kt - onBind return type
const musicServicePath = path.join(__dirname, 'node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/service/MusicService.kt');

if (!fs.existsSync(musicServicePath)) {
  console.log('⚠️  MusicService.kt not found, skipping');
} else {
  let musicService = fs.readFileSync(musicServicePath, 'utf8');
  const before = musicService;
  musicService = musicService.replace(
    /override fun onBind\(intent: Intent\?\): IBinder \{/g,
    'override fun onBind(intent: Intent?): IBinder? {'
  );
  if (musicService !== before) {
    fs.writeFileSync(musicServicePath, musicService);
    console.log('✅ Fixed MusicService.kt onBind');
  } else {
    console.log('ℹ️  MusicService.kt onBind already fixed or not found');
  }
}

// Fix MusicModule.kt - null assertions
const musicModulePath = path.join(__dirname, 'node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/module/MusicModule.kt');

if (!fs.existsSync(musicModulePath)) {
  console.log('⚠️  MusicModule.kt not found, skipping');
} else {
  let musicModule = fs.readFileSync(musicModulePath, 'utf8');
  const before = musicModule;
  musicModule = musicModule.replace(
    /Arguments\.fromBundle\(musicService\.tracks\[index\]\.originalItem\)/g,
    'Arguments.fromBundle(musicService.tracks[index].originalItem!!)'
  );
  musicModule = musicModule.replace(
    /Arguments\.fromBundle\(\s*musicService\.tracks\[musicService\.getCurrentTrackIndex\(\)\]\.originalItem\s*\)/g,
    'Arguments.fromBundle(\n                musicService.tracks[musicService.getCurrentTrackIndex()].originalItem!!\n            )'
  );
  if (musicModule !== before) {
    fs.writeFileSync(musicModulePath, musicModule);
    console.log('✅ Fixed MusicModule.kt null assertions');
  } else {
    console.log('ℹ️  MusicModule.kt already fixed or pattern not found');
  }
}