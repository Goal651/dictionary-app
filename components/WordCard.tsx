import { WordEntry } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AudioButton from './AudioButton';

interface WordCardProps {
  entry: WordEntry;
}

export default function WordCard({ entry }: WordCardProps) {
  // Pick the first audio URL available in phonetics
  const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio ?? '';

  // Best phonetic text: prefer entry.phonetic, otherwise first phonetics item with text
  const phoneticText =
    entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Word + phonetic header */}
      <View style={styles.header}>
        <View style={styles.wordRow}>
          <Text style={styles.word}>{entry.word}</Text>
          {audioUrl ? <AudioButton audioUrl={audioUrl} /> : null}
        </View>
        {phoneticText ? (
          <Text style={styles.phonetic}>{phoneticText}</Text>
        ) : null}
      </View>

      {/* Meanings */}
      {entry.meanings?.map((meaning, mIdx) => (
        <View key={mIdx} style={styles.meaningBlock}>
          {/* Part of speech badge */}
          <View style={styles.posRow}>
            <View style={styles.posBadge}>
              <Text style={styles.posText}>{meaning.partOfSpeech}</Text>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Definitions */}
          {meaning.definitions.map((def, dIdx) => (
            <View key={dIdx} style={styles.definitionItem}>
              <Text style={styles.defNumber}>{dIdx + 1}.</Text>
              <View style={styles.defBody}>
                <Text style={styles.defText}>{def.definition}</Text>
                {def.example ? (
                  <Text style={styles.example}>"{def.example}"</Text>
                ) : null}
              </View>
            </View>
          ))}

          {/* Synonyms */}
          {meaning.synonyms?.length > 0 && (
            <View style={styles.tagSection}>
              <Text style={styles.tagLabel}>Synonyms: </Text>
              <Text style={styles.tagValues}>{meaning.synonyms.slice(0, 6).join(', ')}</Text>
            </View>
          )}

          {/* Antonyms */}
          {meaning.antonyms?.length > 0 && (
            <View style={styles.tagSection}>
              <Text style={styles.tagLabel}>Antonyms: </Text>
              <Text style={styles.tagValues}>{meaning.antonyms.slice(0, 6).join(', ')}</Text>
            </View>
          )}
        </View>
      ))}

      {/* Source */}
      {entry.sourceUrls?.length > 0 && (
        <Text style={styles.source}>Source: {entry.sourceUrls[0]}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e3a5f',
    letterSpacing: -0.5,
  },
  phonetic: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  meaningBlock: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  posRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  posBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  posText: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 13,
    fontStyle: 'italic',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 10,
  },
  definitionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  defNumber: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 6,
    marginTop: 2,
    minWidth: 18,
  },
  defBody: {
    flex: 1,
  },
  defText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  example: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  tagSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tagLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  tagValues: {
    fontSize: 13,
    color: '#3b82f6',
    flex: 1,
    flexWrap: 'wrap',
  },
  source: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});
