import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';

interface AudioButtonProps {
  audioUrl: string;
}

/**
 * Opens the pronunciation audio URL in the device browser / media player.
 * expo-av is not installed, so we use Linking as a reliable fallback.
 */
export default function AudioButton({ audioUrl }: AudioButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!audioUrl) return null;

  const handlePress = async () => {
    setLoading(true);
    try {
      const supported = await Linking.canOpenURL(audioUrl);
      if (supported) {
        await Linking.openURL(audioUrl);
      } else {
        Alert.alert('Unavailable', 'Cannot open audio on this device.');
      }
    } catch {
      Alert.alert('Error', 'Failed to play pronunciation audio.');
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
