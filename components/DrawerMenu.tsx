import { ThemeName, useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    PanResponder,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;
// how far right the user must drag before drawer auto-closes
const SWIPE_CLOSE_THRESHOLD = DRAWER_WIDTH * 0.35;

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
  const { theme, allThemes, setTheme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [filterQuery, setFilterQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // ── open / close animation ──────────────────────────────────────────────────
  const openDrawer = () => {
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
  };

  const closeDrawer = (cb?: () => void) => {
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
      cb?.();
    });
  };

  useEffect(() => {
    if (visible) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [visible]);

  // ── swipe-to-close pan responder ────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      // only capture horizontal drags
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 8 && Math.abs(gs.dx) > Math.abs(gs.dy) && gs.dx > 0,
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0) {
          slideAnim.setValue(-gs.dx);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_CLOSE_THRESHOLD || gs.vx > 0.5) {
          closeDrawer(onClose);
        } else {
          // snap back
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  // ── filtered history ────────────────────────────────────────────────────────
  const filteredHistory = filterQuery.trim()
    ? history.filter((w) => w.toLowerCase().includes(filterQuery.toLowerCase()))
    : history;

  if (!mounted) return null;

  // ── dynamic styles that depend on theme ─────────────────────────────────────
  const t = theme;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop — tap to close */}
      <TouchableWithoutFeedback onPress={() => closeDrawer(onClose)}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.drawer,
          {
            backgroundColor: t.drawerBg,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 8,
            borderRightColor: t.drawerBorder,
          },
        ]}
      >
        {/* ── Header ── */}
        <View style={styles.drawerHeader}>
          <View style={styles.logoRow}>
            <View style={[styles.logoCircle, { backgroundColor: t.accent }]}>
              <Text style={styles.logoLetter}>L</Text>
            </View>
            <View>
              <Text style={[styles.appName, { color: t.textPrimary }]}>LexiDict</Text>
              <Text style={[styles.appTagline, { color: t.textMuted }]}>English Dictionary</Text>
            </View>
          </View>

          {/* ✕ Close button — always visible */}
          <TouchableOpacity
            onPress={() => closeDrawer(onClose)}
            style={[styles.closeBtn, { backgroundColor: t.accentLight }]}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <MaterialIcons name="close" size={20} color={t.accent} />
          </TouchableOpacity>
        </View>

        {/* Swipe hint */}
        <Text style={[styles.swipeHint, { color: t.textMuted }]}>
          ← swipe right to close
        </Text>

        {/* Current word banner */}
        {currentWord && (
          <View style={[styles.currentWordBanner, { backgroundColor: t.accentLight, borderColor: t.border }]}>
            <MaterialIcons name="book" size={13} color={t.accent} />
            <Text style={[styles.currentWordLabel, { color: t.textMuted }]}>Viewing: </Text>
            <Text style={[styles.currentWordValue, { color: t.accent }]}>{currentWord}</Text>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: t.drawerBorder }]} />

        {/* ── History section header ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="history" size={15} color={t.accent} />
            <Text style={[styles.sectionTitle, { color: t.textSecondary }]}>Search History</Text>
            {history.length > 0 && (
              <View style={[styles.countBadge, { backgroundColor: t.accentLight }]}>
                <Text style={[styles.countText, { color: t.accent }]}>{history.length}</Text>
              </View>
            )}
          </View>
          {history.length > 0 && (
            <TouchableOpacity onPress={onClearHistory} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter — show when > 4 items */}
        {history.length > 4 && (
          <View style={[styles.filterRow, { backgroundColor: t.bgInput, borderColor: t.border }]}>
            <MaterialIcons name="filter-list" size={15} color={t.textMuted} />
            <TextInput
              style={[styles.filterInput, { color: t.textSecondary }]}
              placeholder="Filter history..."
              placeholderTextColor={t.textMuted}
              value={filterQuery}
              onChangeText={setFilterQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {filterQuery.length > 0 && (
              <TouchableOpacity onPress={() => setFilterQuery('')}>
                <MaterialIcons name="cancel" size={15} color={t.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── History list ── */}
        <View style={styles.listContainer}>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="manage-search" size={44} color={t.border} />
              <Text style={[styles.emptyText, { color: t.textMuted }]}>No searches yet</Text>
              <Text style={[styles.emptySubText, { color: t.border }]}>
                Words you search will appear here
              </Text>
            </View>
          ) : filteredHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="search-off" size={38} color={t.border} />
              <Text style={[styles.emptyText, { color: t.textMuted }]}>
                No match for "{filterQuery}"
              </Text>
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
                    style={[
                      styles.historyItem,
                      { borderBottomColor: t.drawerBorder },
                      isActive && { backgroundColor: t.accentLight },
                    ]}
                    onPress={() => {
                      onSelectWord(item);
                      closeDrawer(onClose);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Search ${item}`}
                  >
                    <View style={[styles.historyIndex, { backgroundColor: t.bgCard }]}>
                      <Text style={[styles.historyIndexText, { color: t.textMuted }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.historyWord,
                        { color: isActive ? t.accent : t.textSecondary },
                        isActive && { fontWeight: '700' },
                      ]}
                    >
                      {item}
                    </Text>
                    {isActive && (
                      <View style={[styles.activePill, { backgroundColor: t.accentLight }]}>
                        <Text style={[styles.activePillText, { color: t.accent }]}>now</Text>
                      </View>
                    )}
                    <MaterialIcons
                      name="chevron-right"
                      size={16}
                      color={isActive ? t.accent : t.border}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* ── Theme picker (footer) ── */}
        <View style={[styles.themeSection, { borderTopColor: t.drawerBorder }]}>
          <View style={styles.themeLabelRow}>
            <MaterialIcons name="palette" size={15} color={t.accent} />
            <Text style={[styles.themeLabel, { color: t.textMuted }]}>Theme</Text>
          </View>
          <View style={styles.themeChips}>
            {allThemes.map((th) => {
              const active = th.name === t.name;
              return (
                <TouchableOpacity
                  key={th.name}
                  onPress={() => setTheme(th.name as ThemeName)}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: active ? t.accent : t.bgCard,
                      borderColor: active ? t.accent : t.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${th.label} theme`}
                >
                  <Text style={styles.themeEmoji}>{th.emoji}</Text>
                  <Text
                    style={[
                      styles.themeChipText,
                      { color: active ? '#fff' : t.textMuted },
                    ]}
                  >
                    {th.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
  },
  appTagline: {
    fontSize: 10,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeHint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  currentWordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    gap: 4,
    borderWidth: 1,
  },
  currentWordLabel: {
    fontSize: 11,
  },
  currentWordValue: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    marginHorizontal: 18,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  clearAllBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  clearAllText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 18,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    borderWidth: 1,
  },
  filterInput: {
    flex: 1,
    fontSize: 13,
    height: 24,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 2,
    borderBottomWidth: 1,
  },
  historyIndex: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyIndexText: {
    fontSize: 10,
    fontWeight: '600',
  },
  historyWord: {
    flex: 1,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  activePill: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // ── Theme picker ──
  themeSection: {
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
  },
  themeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  themeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  themeEmoji: {
    fontSize: 13,
  },
  themeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
