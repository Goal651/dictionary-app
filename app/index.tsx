import DrawerMenu from '@/components/DrawerMenu';
import EmptyState from '@/components/EmptyState';
import ErrorCard from '@/components/ErrorCard';
import SearchBar, { SearchBarRef } from '@/components/SearchBar';
import WordCard from '@/components/WordCard';
import { DictionaryProvider, useDictionary } from '@/contexts/DictionaryContext';
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchBarRef = useRef<SearchBarRef>(null);

  // Called by SearchBar — just forward to context
  const handleSearch = (word: string) => {
    searchWord(word);
  };

  // Called from drawer history list
  // 1. Sync the input field value so user sees what was selected
  // 2. Trigger search
  const handleHistorySelect = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  // Retry the last searched word from ErrorCard
  const handleRetryWord = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  // "New Search" — clear error and focus input
  const handleNewSearch = () => {
    clearError();
    searchBarRef.current?.clear();
    searchBarRef.current?.focus();
  };

  // Suggestion chip tapped on empty state
  const handleSuggestion = (word: string) => {
    searchBarRef.current?.setValue(word);
    searchWord(word);
  };

  const showEmpty = !loading && !error && !wordEntry;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.iconBtn}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <MaterialIcons name="menu" size={26} color="#1e3a5f" />
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={styles.topTitle}>LexiDict</Text>
          <Text style={styles.topSubtitle}>English Dictionary</Text>
        </View>

        {/* History count badge */}
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.iconBtn}
          accessibilityLabel={`History — ${history.length} words`}
        >
          <MaterialIcons name="history" size={24} color="#6b7280" />
          {history.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {history.length > 9 ? '9+' : history.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchSection}>
        <SearchBar
          ref={searchBarRef}
          onSearch={handleSearch}
          loading={loading}
        />
      </View>

      {/* ── Content area ── */}
      <View style={styles.content}>
        {/* Loading skeleton */}
        {loading && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Looking up "{lastSearchedWord}"…</Text>
          </Animated.View>
        )}

        {/* Error state */}
        {!loading && error && (
          <ErrorCard
            title={error.title}
            message={error.message}
            resolution={error.resolution}
            lastWord={lastSearchedWord}
            onRetry={handleNewSearch}
            onSearchAgain={handleRetryWord}
          />
        )}

        {/* Empty / welcome state */}
        {showEmpty && (
          <EmptyState onSuggestionPress={handleSuggestion} />
        )}

        {/* Word result */}
        {!loading && !error && wordEntry && (
          <WordCard entry={wordEntry} />
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
    <DictionaryProvider>
      <DictionaryApp />
    </DictionaryProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1e3a5f',
    letterSpacing: -0.3,
  },
  topSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '800',
  },

  // Search
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Loading
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 60,
  },
  loadingText: {
    fontSize: 15,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
