import DrawerMenu from '@/components/DrawerMenu';
import EmptyState from '@/components/EmptyState';
import ErrorCard from '@/components/ErrorCard';
import SearchBar, { SearchBarRef } from '@/components/SearchBar';
import WordCard from '@/components/WordCard';
import { DictionaryProvider, useDictionary } from '@/contexts/DictionaryContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

function DictionaryApp() {
  const {
    wordEntry,
    loading,
    error,
    history,
    lastSearchedWord,
    searchWord,
    clearError,
    clearHistory,
  } = useDictionary();
  const { theme } = useTheme();
  const t = theme;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchBarRef = useRef<SearchBarRef>(null);

  const handleSearch = (word: string) => searchWord(word);

  const handleHistorySelect = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  const handleRetryWord = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  const handleNewSearch = () => {
    clearError();
    searchBarRef.current?.clear();
    searchBarRef.current?.focus();
  };

  const handleSuggestion = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  const showEmpty = !loading && !error && !wordEntry;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <StatusBar
        barStyle={t.statusBar}
        backgroundColor={t.bgSection}
      />

      {/* ── Top bar ── */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: t.bgSection, borderBottomColor: t.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={[styles.iconBtn, { backgroundColor: t.accentLight }]}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <MaterialIcons name="menu" size={22} color={t.accent} />
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={[styles.topTitle, { color: t.textPrimary }]}>LexiDict</Text>
          <Text style={[styles.topSubtitle, { color: t.textMuted }]}>English Dictionary</Text>
        </View>

        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={[styles.iconBtn, { backgroundColor: t.accentLight }]}
          accessibilityLabel={`History — ${history.length} words`}
        >
          <MaterialIcons name="history" size={22} color={t.accent} />
          {history.length > 0 && (
            <View style={[styles.badge, { backgroundColor: t.accent }]}>
              <Text style={styles.badgeText}>
                {history.length > 9 ? '9+' : history.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search bar ── */}
      <View
        style={[
          styles.searchSection,
          { backgroundColor: t.bgSection, borderBottomColor: t.border },
        ]}
      >
        <SearchBar
          ref={searchBarRef}
          onSearch={handleSearch}
          loading={loading}
          theme={t}
        />
      </View>

      {/* ── Content ── */}
      <View style={styles.content}>
        {loading && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.loadingBox}>
            <ActivityIndicator size="large" color={t.accent} />
            <Text style={[styles.loadingText, { color: t.textMuted }]}>
              Looking up "{lastSearchedWord}"…
            </Text>
          </Animated.View>
        )}

        {!loading && error && (
          <ErrorCard
            title={error.title}
            message={error.message}
            resolution={error.resolution}
            lastWord={lastSearchedWord}
            onRetry={handleNewSearch}
            onSearchAgain={handleRetryWord}
            theme={t}
          />
        )}

        {showEmpty && (
          <EmptyState onSuggestionPress={handleSuggestion} theme={t} />
        )}

        {!loading && !error && wordEntry && (
          <WordCard entry={wordEntry} theme={t} />
        )}
      </View>

      {/* ── Drawer ── */}
      <DrawerMenu
        visible={drawerOpen}
        history={history}
        currentWord={wordEntry?.word ?? null}
        onClose={() => setDrawerOpen(false)}
        onSelectWord={handleHistorySelect}
        onClearHistory={clearHistory}
      />
    </SafeAreaView>
  );
}

export default function IndexScreen() {
  return (
    <ThemeProvider>
      <DictionaryProvider>
        <DictionaryApp />
      </DictionaryProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: { alignItems: 'center' },
  topTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  topSubtitle: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '800',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 60,
  },
  loadingText: {
    fontSize: 15,
    fontStyle: 'italic',
  },
});
