import axios from 'axios';
import { WordEntry } from '../../types/search';
import { API_CONFIG, API_ENDPOINTS } from '../constants';

class SearchService {
  /**
   * Search for a word using the Free Dictionary API.
   * The API returns an array of WordEntry; we return the first entry.
   * On 404 the API returns { title, message, resolution } — we throw it so
   * the context can display a proper "word not found" message.
   */
  async search(word: string): Promise<WordEntry> {
    try {
      const response = await axios.get<WordEntry[]>(API_ENDPOINTS.SEARCH(word), {
        timeout: API_CONFIG.TIMEOUT,
      });
      // API always returns an array; take the first entry
      return response.data[0];
    } catch (error: any) {
      if (error.response) {
        // Propagate the API error body (title / message / resolution)
        throw error.response.data;
      }
      // Network / timeout error
      throw { title: 'Network Error', message: 'Could not reach the server.', resolution: 'Check your internet connection and try again.' };
    }
  }
}

export const searchService = new SearchService();
