const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withFixRNTP(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const filePath = path.join(
        config.modRequest.projectRoot,
        "node_modules/react-native-track-player/android/src/main/java/com/doublesymmetry/trackplayer/service/MusicService.kt",
      );
      let contents = fs.readFileSync(filePath, "utf8");
      contents = contents.replace(
        /override fun onBind\(intent: Intent\?\): IBinder \{/g,
        "override fun onBind(intent: Intent?): IBinder? {",
      );
      fs.writeFileSync(filePath, contents);
      return config;
    },
  ]);
};
