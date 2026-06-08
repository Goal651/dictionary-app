import DrawerMenu from '@/components/DrawerMenu';
import EmptyState from '@/components/EmptyState';
import ErrorCard from '@/components/ErrorCard';
import SearchBar from '@/components/SearchBar';
import WordCard from '@/components/WordCard';
import { DictionaryProvider, useDictionary } from '@/contexts/DictionaryContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

function DictionaryApp() {
  const { wordEntry, loading, error, history, searchWord, clearError } = useDictionary();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = (word: string) => {
    clearError();
    searchWord(word);
  };

  const handleHistorySelect = (word: string) => {
    searchWord(word);
  };

  const showEmpty = !loading && !error && !wordEntry;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          style={styles.menuBtn}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <MaterialIcons name="menu" size={26} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>LexiDict</Text>
        <View style={styles.menuBtn} />
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {error && (
          <ErrorCard
            title={error.title}
            message={error.message}
            resolution={error.resolution}
            onRetry={() => {
              clearError();
            }}
          />
        )}

        {showEmpty && <EmptyState />}

        {wordEntry && !loading && !error && <WordCard entry={wordEntry} />}
      </View>

      {/* Drawer */}
      <DrawerMenu
        visible={drawerOpen}
        history={history}
        onClose={() => setDrawerOpen(false)}
        onSelectWord={handleHistorySelect}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e3a5f',
    letterSpacing: -0.3,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
