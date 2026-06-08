import { WordEntry } from '@/types';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AudioButton from './AudioButton';

interface WordCardProps {
  entry: WordEntry;
}

export default function WordCard({ entry }: WordCardProps) {
  const [expandedMeanings, setExpandedMeanings] = useState<Record<number, boolean>>({});

  const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio ?? '';
  const phoneticText =
    entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || '';

  const toggleMeaning = (idx: number) => {
    setExpandedMeanings((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // POS badge colour map
  const posColors: Record<string, { bg: string; text: string }> = {
    noun:        { bg: '#eff6ff', text: '#3b82f6' },
    verb:        { bg: '#f0fdf4', text: '#16a34a' },
    adjective:   { bg: '#fff7ed', text: '#ea580c' },
    adverb:      { bg: '#fdf4ff', text: '#9333ea' },
    pronoun:     { bg: '#fef9c3', text: '#ca8a04' },
    preposition: { bg: '#fff1f2', text: '#e11d48' },
    conjunction: { bg: '#f0fdfa', text: '#0d9488' },
    interjection:{ bg: '#fef3c7', text: '#d97706' },
  };

  const getPosColor = (pos: string) =>
    posColors[pos.toLowerCase()] ?? { bg: '#f3f4f6', text: '#374151' };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Word header card ── */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.header}>
        <View style={styles.wordRow}>
          <Text style={styles.word} numberOfLines={2} adjustsFontSizeToFit>
            {entry.word}
          </Text>
          {audioUrl ? <AudioButton audioUrl={audioUrl} /> : null}
        </View>

        {phoneticText ? (
          <Text style={styles.phonetic}>{phoneticText}</Text>
        ) : null}

        {/* All phonetic variants */}
        {entry.phonetics?.filter((p) => p.text && p.text !== phoneticText).length > 0 && (
          <View style={styles.phoneticVariants}>
            {entry.phonetics
              .filter((p) => p.text && p.text !== phoneticText)
              .slice(0, 3)
              .map((p, i) => (
                <Text key={i} style={styles.phoneticVariant}>
                  {p.text}
                </Text>
              ))}
          </View>
        )}

        {/* Meanings count chip */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statChipText}>
              {entry.meanings?.length ?? 0} meaning{entry.meanings?.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {entry.meanings?.reduce((acc, m) => acc + m.definitions.length, 0) > 0 && (
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>
                {entry.meanings.reduce((acc, m) => acc + m.definitions.length, 0)} definition
                {entry.meanings.reduce((acc, m) => acc + m.definitions.length, 0) !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* ── Meanings ── */}
      {entry.meanings?.map((meaning, mIdx) => {
        const isExpanded = expandedMeanings[mIdx] !== false; // default expanded
        const posColor = getPosColor(meaning.partOfSpeech);
        const previewDef = meaning.definitions[0];

        return (
          <Animated.View
            key={mIdx}
            entering={FadeInDown.delay(mIdx * 80).duration(350)}
            style={styles.meaningBlock}
          >
            {/* POS header row — tap to collapse/expand */}
            <TouchableOpacity
              style={styles.posRow}
              onPress={() => toggleMeaning(mIdx)}
              activeOpacity={0.7}
            >
              <View style={[styles.posBadge, { backgroundColor: posColor.bg }]}>
                <Text style={[styles.posText, { color: posColor.text }]}>
                  {meaning.partOfSpeech}
                </Text>
              </View>
              <View style={styles.posDivider} />
              <Text style={styles.defCount}>
                {meaning.definitions.length} def.
              </Text>
              <Text style={styles.collapseIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded ? (
              <>
                {meaning.definitions.map((def, dIdx) => (
                  <View key={dIdx} style={styles.definitionItem}>
                    <View style={styles.defBullet}>
                      <Text style={styles.defBulletText}>{dIdx + 1}</Text>
                    </View>
                    <View style={styles.defBody}>
                      <Text style={styles.defText}>{def.definition}</Text>
                      {def.example ? (
                        <View style={styles.exampleBox}>
                          <Text style={styles.exampleText}>"{def.example}"</Text>
                        </View>
                      ) : null}
                      {/* Per-definition synonyms */}
                      {def.synonyms?.length > 0 && (
                        <View style={styles.inlineTagRow}>
                          <Text style={styles.inlineTagLabel}>e.g. </Text>
                          <Text style={styles.inlineTagBlue}>
                            {def.synonyms.slice(0, 4).join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}

                {/* Synonyms */}
                {meaning.synonyms?.length > 0 && (
                  <View style={styles.tagSection}>
                    <Text style={styles.tagLabel}>Synonyms</Text>
                    <View style={styles.tagChips}>
                      {meaning.synonyms.slice(0, 8).map((s, i) => (
                        <View key={i} style={[styles.chip, styles.chipBlue]}>
                          <Text style={styles.chipTextBlue}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Antonyms */}
                {meaning.antonyms?.length > 0 && (
                  <View style={styles.tagSection}>
                    <Text style={styles.tagLabel}>Antonyms</Text>
                    <View style={styles.tagChips}>
                      {meaning.antonyms.slice(0, 8).map((a, i) => (
                        <View key={i} style={[styles.chip, styles.chipRed]}>
                          <Text style={styles.chipTextRed}>{a}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            ) : (
              /* Collapsed preview */
              <Text style={styles.collapsedPreview} numberOfLines={2}>
                {previewDef?.definition}
              </Text>
            )}
          </Animated.View>
        );
      })}

      {/* Source URL */}
      {entry.sourceUrls?.length > 0 && (
        <Text style={styles.source}>📖 Source: {entry.sourceUrls[0]}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 48 },

  // Header
  header: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  word: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1e3a5f',
    letterSpacing: -0.5,
    flex: 1,
  },
  phonetic: {
    fontSize: 17,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  phoneticVariants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  phoneticVariant: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statChip: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  statChipText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },

  // Meaning block
  meaningBlock: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  posText: {
    fontWeight: '700',
    fontSize: 13,
    fontStyle: 'italic',
  },
  posDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 10,
  },
  defCount: {
    fontSize: 11,
    color: '#9ca3af',
    marginRight: 6,
  },
  collapseIcon: {
    fontSize: 10,
    color: '#9ca3af',
  },
  collapsedPreview: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Definitions
  definitionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  defBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  defBulletText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
  },
  defBody: { flex: 1 },
  defText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 23,
  },
  exampleBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#bfdbfe',
    marginTop: 6,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  exampleText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 19,
  },
  inlineTagRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  inlineTagLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  inlineTagBlue: {
    fontSize: 12,
    color: '#3b82f6',
    flexShrink: 1,
  },

  // Synonym / antonym chips
  tagSection: { marginTop: 10 },
  tagLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  tagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipBlue: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  chipRed: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  chipTextBlue: {
    fontSize: 12,
    color: '#2563eb',
  },
  chipTextRed: {
    fontSize: 12,
    color: '#e11d48',
  },

  source: {
    fontSize: 11,
    color: '#d1d5db',
    marginTop: 6,
    textAlign: 'center',
  },
});
