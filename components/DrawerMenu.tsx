import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.78;

interface DrawerMenuProps {
  visible: boolean;
  history: string[];
  currentWord: string | null;
  onClose: () => void;
  onSelectWord: (word: string) => void;
  onClearHistory: () => void;
}

export default function DrawerMenu({
  visible,
  history,
  currentWord,
  onClose,
  onSelectWord,
  onClearHistory,
}: DrawerMenuProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [filterQuery, setFilterQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 16,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
        setFilterQuery('');
      });
    }
  }, [visible]);

  const filteredHistory = filterQuery.trim()
    ? history.filter((w) => w.toLowerCase().includes(filterQuery.toLowerCase()))
    : history;

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 8 },
        ]}
      >
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>L</Text>
            </View>
            <View>
              <Text style={styles.appName}>LexiDict</Text>
              <Text style={styles.appTagline}>English Dictionary</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close menu">
            <MaterialIcons name="close" size={22} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Current word pill */}
        {currentWord && (
          <View style={styles.currentWordBanner}>
            <MaterialIcons name="book" size={14} color="#3b82f6" />
            <Text style={styles.currentWordLabel}>Currently viewing: </Text>
            <Text style={styles.currentWordValue}>{currentWord}</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Section header + clear */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="history" size={16} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Search History</Text>
            {history.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{history.length}</Text>
              </View>
            )}
          </View>
          {history.length > 0 && (
            <TouchableOpacity onPress={onClearHistory} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter input — only show if more than 4 items */}
        {history.length > 4 && (
          <View style={styles.filterRow}>
            <MaterialIcons name="filter-list" size={16} color="#9ca3af" />
            <TextInput
              style={styles.filterInput}
              placeholder="Filter history..."
              placeholderTextColor="#c4b5fd"
              value={filterQuery}
              onChangeText={setFilterQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {filterQuery.length > 0 && (
              <TouchableOpacity onPress={() => setFilterQuery('')}>
                <MaterialIcons name="cancel" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* History list */}
        <View style={styles.listContainer}>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="manage-search" size={48} color="#e5e7eb" />
              <Text style={styles.emptyText}>No searches yet</Text>
              <Text style={styles.emptySubText}>Words you search will appear here</Text>
            </View>
          ) : filteredHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="search-off" size={40} color="#e5e7eb" />
              <Text style={styles.emptyText}>No match for "{filterQuery}"</Text>
            </View>
          ) : (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const isActive = item.toLowerCase() === currentWord?.toLowerCase();
                return (
                  <TouchableOpacity
                    style={[styles.historyItem, isActive && styles.historyItemActive]}
                    onPress={() => {
                      onSelectWord(item);
                      onClose();
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Search ${item}`}
                  >
                    <View style={styles.historyIndex}>
                      <Text style={styles.historyIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.historyWord, isActive && styles.historyWordActive]}>
                      {item}
                    </Text>
                    {isActive && (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>active</Text>
                      </View>
                    )}
                    <MaterialIcons
                      name="chevron-right"
                      size={16}
                      color={isActive ? '#3b82f6' : '#d1d5db'}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  appName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e3a5f',
  },
  appTagline: {
    fontSize: 11,
    color: '#9ca3af',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentWordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 18,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    gap: 4,
  },
  currentWordLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  currentWordValue: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 18,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  countBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  countText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginHorizontal: 18,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  filterInput: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    height: 26,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
  historyItemActive: {
    backgroundColor: '#eff6ff',
  },
  historyIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyIndexText: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
  historyWord: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    textTransform: 'capitalize',
  },
  historyWordActive: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  activePill: {
    backgroundColor: '#dbeafe',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  activePillText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingTop: 50,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
