import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getGAConfig,
  getAnalyticsDataClient,
  getCachedRealtime,
  setCachedRealtime,
} from '@/lib/googleAnalytics';

export async function GET(request) {
  // 1. Verify Admin Authentication & Authorization
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  // 2. Validate Google Analytics credentials
  const config = getGAConfig();
  if (!config.isConfigured) {
    return NextResponse.json(
      {
        configured: false,
        activeUsers30Min: 0,
        activePages: [],
        activeCountries: [],
        message: 'Google Analytics credentials not configured.',
      },
      { status: 200 }
    );
  }

  // Check 20-second cache
  const cached = getCachedRealtime();
  if (cached) {
    return NextResponse.json({ ...cached, cached: true }, { status: 200 });
  }

  try {
    const client = getAnalyticsDataClient();
    const property = `properties/${config.propertyId}`;

    // Run realtime report
    const [overviewRealtime, pagesRealtime, countriesRealtime] = await Promise.all([
      // Total active users in last 30 mins
      client.runRealtimeReport({
        property,
        metrics: [{ name: 'activeUsers' }],
      }),
      // Active pages right now
      client
        .runRealtimeReport({
          property,
          dimensions: [{ name: 'unifiedScreenName' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 5,
        })
        .catch(() => [null]),
      // Active countries right now
      client
        .runRealtimeReport({
          property,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 5,
        })
        .catch(() => [null]),
    ]);

    const activeUsers30Min = Number(
      overviewRealtime[0]?.rows?.[0]?.metricValues?.[0]?.value || 0
    );

    const activePages = (pagesRealtime[0]?.rows || []).map((row) => ({
      page: row.dimensionValues?.[0]?.value || '/',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const activeCountries = (countriesRealtime[0]?.rows || []).map((row) => ({
      country: row.dimensionValues?.[0]?.value || '(not set)',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const responsePayload = {
      configured: true,
      cached: false,
      activeUsers30Min,
      activePages,
      activeCountries,
      timestamp: new Date().toISOString(),
    };

    setCachedRealtime(responsePayload);

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('GA4 Realtime API Error:', error);
    return NextResponse.json(
      {
        configured: true,
        activeUsers30Min: 0,
        activePages: [],
        activeCountries: [],
        error: true,
        message: 'Unable to fetch realtime data at this time.',
      },
      { status: 200 }
    );
  }
}
