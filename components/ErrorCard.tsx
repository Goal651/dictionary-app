import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorCardProps {
  title: string;
  message: string;
  resolution: string;
  onRetry?: () => void;
}

export default function ErrorCard({ title, message, resolution, onRetry }: ErrorCardProps) {
  const isNotFound = title?.toLowerCase().includes('no definitions') ||
    message?.toLowerCase().includes('found') ||
    title?.toLowerCase().includes('not found');

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={isNotFound ? 'search-off' : 'error-outline'}
          size={52}
          color={isNotFound ? '#f59e0b' : '#ef4444'}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {resolution ? <Text style={styles.resolution}>{resolution}</Text> : null}

      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <MaterialIcons name="refresh" size={18} color="#fff" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 6,
  },
  resolution: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
