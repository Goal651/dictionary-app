import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

interface AudioButtonProps {
  audioUrl: string;
}

export default function AudioButton({ audioUrl }: AudioButtonProps) {
  const [loading, setLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const cleanup = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };


  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);
  if (!audioUrl) return null;



  const handlePress = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Clean up previous sound if exists
      await cleanup();

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load and play the audio
      console.log('Loading audio from:', audioUrl);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true } // Auto-play immediately
      );

      soundRef.current = sound;

      // Optional: Add callback for when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          cleanup();
        }
      });

    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play pronunciation audio.');
      await cleanup();
    } finally {
      setLoading(false);
    }
  };


  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.btn}
      accessibilityLabel="Play pronunciation"
      accessibilityRole="button"
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#3b82f6" />
      ) : (
        <MaterialIcons name="volume-up" size={22} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});