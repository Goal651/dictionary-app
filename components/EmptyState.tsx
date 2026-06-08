import { Theme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface EmptyStateProps {
  onSuggestionPress?: (word: string) => void;
  theme?: Theme;
}

const SUGGESTIONS = ['eloquent', 'serendipity', 'ephemeral', 'resilient', 'melancholy'];

export default function EmptyState({ onSuggestionPress, theme: t }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.iconWrap}>
        <MaterialIcons name="menu-book" size={60} color="#93c5fd" />
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(100).duration(400)} style={styles.title}>
        Explore English Words
      </Animated.Text>

      <Animated.Text entering={FadeInDown.delay(180).duration(400)} style={styles.subtitle}>
        Type any word to get its definition, phonetic spelling, examples, and more.
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.suggestSection}>
        <Text style={styles.suggestLabel}>Try one of these</Text>
        <View style={styles.chips}>
          {SUGGESTIONS.map((word) => (
            <TouchableOpacity
              key={word}
              style={styles.chip}
              onPress={() => onSuggestionPress?.(word)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Search ${word}`}
            >
              <Text style={styles.chipText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(380).duration(400)} style={styles.featureRow}>
        {[
          { icon: 'record-voice-over', label: 'Pronunciation' },
          { icon: 'format-list-bulleted', label: 'Definitions' },
          { icon: 'lightbulb-outline', label: 'Examples' },
        ].map((f) => (
          <View key={f.label} style={styles.featureItem}>
            <MaterialIcons name={f.icon as any} size={22} color="#93c5fd" />
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 60,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  suggestSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },
  suggestLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  chipText: {
    fontSize: 13,
    color: '#3b82f6',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 24,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
