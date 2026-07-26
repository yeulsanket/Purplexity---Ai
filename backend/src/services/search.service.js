import { tavily } from '@tavily/core';
import { ENV } from '../config/env.js';

export const performWebSearch = async (query) => {
  if (!ENV.TAVILY_API_KEY) {
    console.warn('Tavily API key missing. Web search skipped.');
    return { context: null, sources: [] };
  }

  try {
    const tvly = tavily({ apiKey: ENV.TAVILY_API_KEY });
    
    // Perform search
    const response = await tvly.search(query, {
      searchDepth: 'basic',
      maxResults: 5,
    });

    // Normalize sources
    const sources = response.results.map((result) => ({
      title: result.title || 'Source',
      url: result.url,
      snippet: result.content,
    }));

    // Build text context for AI injection
    const context = sources
      .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.url}\nContent: ${s.snippet}`)
      .join('\n\n');

    return { context, sources };
  } catch (error) {
    console.error('Web search error:', error);
    return { context: null, sources: [] };
  }
};
