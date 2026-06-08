import { Theme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ErrorCardProps {
  title: string;
  message: string;
  resolution: string;
  lastWord?: string;
  theme?: Theme;
  onRetry?: () => void;
  onSearchAgain?: (word: string) => void;
}

export default function ErrorCard({
  title,
  message,
  resolution,
  lastWord,
  theme: t,
  onRetry,
  onSearchAgain,
}: ErrorCardProps) {
  const isNotFound =
    title?.toLowerCase().includes('no definitions') ||
    title?.toLowerCase().includes('not found') ||
    message?.toLowerCase().includes("couldn't find") ||
    message?.toLowerCase().includes('no definitions');

  const isNetwork =
    title?.toLowerCase().includes('network') ||
    message?.toLowerCase().includes('network') ||
    message?.toLowerCase().includes('server');

  const icon = isNotFound ? 'search-off' : isNetwork ? 'wifi-off' : 'error-outline';
  const iconBg = isNotFound ? '#fff7ed' : isNetwork ? '#eff6ff' : '#fff1f2';
  const iconColor = isNotFound ? '#f59e0b' : isNetwork ? '#3b82f6' : '#ef4444';

  return (
    <Animated.View entering={FadeInDown.duration(350)} style={[styles.container, t && { backgroundColor: t.bgCard }]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={48} color={iconColor} />
      </View>

      <Text style={[styles.title, t && { color: t.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, t && { color: t.textSecondary }]}>{message}</Text>
      {resolution ? <Text style={[styles.resolution, t && { color: t.textMuted }]}>{resolution}</Text> : null}

      <View style={styles.actions}>
        {onSearchAgain && lastWord && (
          <TouchableOpacity
            style={[styles.retryBtn, t && { backgroundColor: t.accent }]}
            onPress={() => onSearchAgain(lastWord)}
            accessibilityRole="button"
          >
            <MaterialIcons name="refresh" size={17} color="#fff" />
            <Text style={styles.retryText}>Retry "{lastWord}"</Text>
          </TouchableOpacity>
        )}

        {onRetry && (
          <TouchableOpacity
            style={[styles.newSearchBtn, t && { backgroundColor: t.accentLight, borderColor: t.border }]}
            onPress={onRetry}
            accessibilityRole="button"
          >
            <MaterialIcons name="search" size={17} color={t?.accent ?? '#3b82f6'} />
            <Text style={[styles.newSearchText, t && { color: t.accent }]}>New Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {isNotFound && (
        <View style={[styles.tipsBox, t && { backgroundColor: t.bgSection }]}>
          <Text style={[styles.tipsTitle, t && { color: t.textMuted }]}>Tips</Text>
          <Text style={[styles.tipItem, t && { color: t.textMuted }]}>• Check the spelling of the word</Text>
          <Text style={[styles.tipItem, t && { color: t.textMuted }]}>• Try searching for the base/root form</Text>
          <Text style={[styles.tipItem, t && { color: t.textMuted }]}>• Only English words are supported</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 4,
  },
  resolution: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  newSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  newSearchText: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 14,
  },
  tipsBox: {
    marginTop: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    gap: 4,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  tipItem: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});
