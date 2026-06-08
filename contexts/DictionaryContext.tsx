import { searchService } from '@/api/services/search';
import { ErrorResponse, WordEntry } from '@/types';
import React, { createContext, useContext, useState } from 'react';

interface DictionaryContextType {
  wordEntry: WordEntry | null;
  loading: boolean;
  error: ErrorResponse | null;
  history: string[];
  lastSearchedWord: string;
  searchWord: (word: string) => Promise<void>;
  clearError: () => void;
  clearHistory: () => void;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

function DictionaryProvider({ children }: { children: React.ReactNode }) {
  const [wordEntry, setWordEntry] = useState<WordEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [lastSearchedWord, setLastSearchedWord] = useState<string>('');

  const searchWord = async (word: string) => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setWordEntry(null);
    setLastSearchedWord(trimmed);

    try {
      const result = await searchService.search(trimmed);
      setWordEntry(result);

      // Deduplicate: remove existing entry (case-insensitive), add to front
      setHistory((prev) => {
        const filtered = prev.filter((w) => w.toLowerCase() !== trimmed);
        return [trimmed, ...filtered].slice(0, 50);
      });
    } catch (err: any) {
      setError({
        title: err?.title ?? 'Error',
        message: err?.message ?? 'Something went wrong.',
        resolution: err?.resolution ?? 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setWordEntry(null);
  };

  const clearHistory = () => setHistory([]);

  return (
    <DictionaryContext.Provider
      value={{ wordEntry, loading, error, history, lastSearchedWord, searchWord, clearError, clearHistory }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}

export { DictionaryProvider, useDictionary };
