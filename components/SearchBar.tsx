import { Theme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchBarProps {
  onSearch: (word: string) => void;
  loading?: boolean;
  theme?: Theme;
}

export interface SearchBarRef {
  setValue: (word: string) => void;
  clear: () => void;
  focus: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ onSearch, loading, theme }, ref) => {
  const t = theme;
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    setValue: (word: string) => {
      setQuery(word);
      setValidationError('');
    },
    clear: () => {
      setQuery('');
      setValidationError('');
    },
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const validate = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a word to search.';
    if (trimmed.length < 2) return 'Word must be at least 2 characters.';
    if (/[^a-zA-Z\s'-]/.test(trimmed)) return 'Only letters, hyphens, and apostrophes are allowed.';
    return '';
  };

  const handleSubmit = () => {
    const err = validate(query);
    if (err) {
      setValidationError(err);
      shake();
      return;
    }
    setValidationError('');
    onSearch(query.trim().toLowerCase());
  };

  const handleClear = () => {
    setQuery('');
    setValidationError('');
    inputRef.current?.focus();
  };

  return (
    <View>
      <Animated.View
        style={[
          styles.row,
          t && { backgroundColor: t.bgInput, borderColor: t.border },
          isFocused && styles.rowFocused,
          isFocused && t && { borderColor: t.borderFocus },
          validationError && styles.rowError,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <MaterialIcons
          name="search"
          size={20}
          color={validationError ? '#ef4444' : isFocused ? (t?.accent ?? '#3b82f6') : (t?.textMuted ?? '#9ca3af')}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={[styles.input, t && { color: t.textSecondary }]}
          placeholder="Search a word..."
          placeholderTextColor={t?.textMuted ?? '#9ca3af'}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (validationError) setValidationError('');
          }}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn} accessibilityLabel="Clear search">
            <MaterialIcons name="cancel" size={18} color={t?.textMuted ?? '#9ca3af'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: t?.accent ?? '#3b82f6' }, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Search"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {validationError ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="info-outline" size={13} color="#ef4444" />
          <Text style={styles.error}>{validationError}</Text>
        </View>
      ) : null}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingLeft: 12,
    paddingRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  rowFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.15,
    elevation: 5,
  },
  rowError: {
    borderColor: '#ef4444',
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  clearBtn: {
    padding: 6,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    elevation: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
  },
});
