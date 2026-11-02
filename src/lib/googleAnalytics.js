import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * Validates whether required Google Analytics Data API credentials exist.
 */
export function getGAConfig() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const clientEmail = process.env.GA_CLIENT_EMAIL?.trim();
  let privateKey = process.env.GA_PRIVATE_KEY?.trim();

  if (privateKey) {
    // Unescape newlines if stored as "\n" in environment variables
    privateKey = privateKey.replace(/\\n/g, '\n');
    // Remove enclosing quotes if any
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
  }

  const missing = [];
  if (!propertyId) missing.push('GA_PROPERTY_ID');
  if (!clientEmail) missing.push('GA_CLIENT_EMAIL');
  if (!privateKey) missing.push('GA_PRIVATE_KEY');

  const isConfigured = missing.length === 0;

  return {
    isConfigured,
    missing,
    propertyId,
    clientEmail,
    privateKey,
  };
}

let cachedClient = null;

/**
 * Returns a singleton instance of BetaAnalyticsDataClient using Service Account credentials.
 */
export function getAnalyticsDataClient() {
  const config = getGAConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: config.clientEmail,
        private_key: config.privateKey,
      },
    });
  }

  return cachedClient;
}

// In-memory cache for standard analytics reports (TTL: 5 minutes)
const reportsCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCachedReport(cacheKey) {
  const cached = reportsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

export function setCachedReport(cacheKey, data) {
  reportsCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

// In-memory cache for real-time reports (TTL: 20 seconds)
let realtimeCache = null;
const REALTIME_CACHE_TTL_MS = 20 * 1000;

export function getCachedRealtime() {
  if (realtimeCache && Date.now() - realtimeCache.timestamp < REALTIME_CACHE_TTL_MS) {
    return realtimeCache.data;
  }
  return null;
}

export function setCachedRealtime(data) {
  realtimeCache = {
    data,
    timestamp: Date.now(),
  };
}
