import { MaterialIcons } from '@expo/vector-icons';
import { createAudioPlayer } from 'expo-audio';
import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

interface AudioButtonProps {
  audioUrl: string;
}

export default function AudioButton({ audioUrl }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const activePlayerRef = useRef<any>(null);

  // 1. Clean the Dictionary API URL string
  const getCleanUrl = (url: string): string | null => {
    if (!url || url.trim() === "") return null;
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return url;
  };

  const cleanUrl = getCleanUrl(audioUrl);

  // 2. Clean up when the user leaves or component unmounts
  useEffect(() => {
    return () => {
      if (activePlayerRef.current) {
        activePlayerRef.current.remove();
        activePlayerRef.current.release();
      }
    };
  }, []);

  if (!cleanUrl) return null;

  const handlePress = async () => {
    try {
      // If a track is already playing, clear it out immediately
      if (activePlayerRef.current) {
        activePlayerRef.current.remove();
        activePlayerRef.current.release();
        activePlayerRef.current = null;
      }

      setIsPlaying(true);

      // Fix: Use the correct factory function instead of "new" constructor
      const player = createAudioPlayer(cleanUrl);
      activePlayerRef.current = player;

      player.play();

      // Dictionary API audio clips are incredibly short (usually under 1.5 seconds)
      // This timeout cleanly clears the indicator state after playback completes
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);

    } catch (error) {
      console.error('Playback error:', error);
      Alert.alert('Error', 'Failed to play pronunciation audio.');
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.btn}
      accessibilityLabel="Play pronunciation"
      accessibilityRole="button"
    >
      {isPlaying ? (
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