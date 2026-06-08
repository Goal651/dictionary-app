import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.78;

interface DrawerMenuProps {
  visible: boolean;
  history: string[];
  onClose: () => void;
  onSelectWord: (word: string) => void;
}

export default function DrawerMenu({
  visible,
  history,
  onClose,
  onSelectWord,
}: DrawerMenuProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
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
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && (slideAnim as any)._value === -DRAWER_WIDTH) return null;

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
          { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 16 },
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
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close menu">
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Search history */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="history" size={18} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Search History</Text>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <MaterialIcons name="manage-search" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>No searches yet</Text>
              <Text style={styles.emptySubText}>Words you search will appear here</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item, idx) => `${item}-${idx}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => {
                    onSelectWord(item);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Search ${item}`}
                >
                  <MaterialIcons name="search" size={16} color="#9ca3af" style={styles.historyIcon} />
                  <Text style={styles.historyWord}>{item}</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#d1d5db" />
                </TouchableOpacity>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  appTagline: {
    fontSize: 12,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  section: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  historyIcon: {
    marginRight: 10,
  },
  historyWord: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    textTransform: 'capitalize',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 13,
    color: '#d1d5db',
    textAlign: 'center',
  },
});
