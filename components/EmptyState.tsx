import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="menu-book" size={64} color="#bfdbfe" />
      </View>
      <Text style={styles.title}>Start Exploring</Text>
      <Text style={styles.subtitle}>
        Type any English word in the search bar above to get its definition, pronunciation, and usage examples.
      </Text>

      <View style={styles.hints}>
        {['apple', 'eloquent', 'serendipity'].map((w) => (
          <View key={w} style={styles.hintChip}>
            <Text style={styles.hintText}>{w}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  hints: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  hintChip: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  hintText: {
    fontSize: 13,
    color: '#3b82f6',
    fontStyle: 'italic',
  },
});
