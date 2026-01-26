import { Audio } from 'expo-av';

let ambientSound: Audio.Sound | null = null;
let chimeSound: Audio.Sound | null = null;

// Remote URLs for MVP to avoid asset linking issues immediately
// In production, these should be local assets
const AMBIENT_PAD_URL =
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impulse-3011.mp3';
const CHIME_URL =
  'https://cdn.pixabay.com/download/audio/2022/03/24/audio_3bed88c6b9.mp3?filename=bell-notification-9805.mp3';

export const SoundService = {
  async loadAmbient(url: string = AMBIENT_PAD_URL) {
    try {
      // Stop existing if any
      if (ambientSound) {
        await ambientSound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { isLooping: true, volume: 0, shouldPlay: true },
      );

      ambientSound = sound;

      // Fade in
      await sound.setVolumeAsync(0.1);
      setTimeout(() => sound.setVolumeAsync(0.3), 500);
      setTimeout(() => sound.setVolumeAsync(0.5), 1000);
    } catch (error) {
      console.log('Error loading ambient sound:', error);
    }
  },

  async playChime() {
    try {
      if (chimeSound) {
        await chimeSound.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          { uri: CHIME_URL },
          { volume: 0.4 },
        );
        chimeSound = sound;
        await sound.playAsync();
      }
    } catch (error) {
      console.log('Error playing chime:', error);
    }
  },

  async stopAll() {
    try {
      if (ambientSound) {
        // Fade out logic could go here
        await ambientSound.stopAsync();
        await ambientSound.unloadAsync();
        ambientSound = null;
      }
      if (chimeSound) {
        await chimeSound.unloadAsync();
        chimeSound = null;
      }
    } catch (error) {
      console.log('Error stopping sounds:', error);
    }
  },
};
