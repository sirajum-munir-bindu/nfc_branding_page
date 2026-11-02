import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getGAConfig,
  getAnalyticsDataClient,
  getCachedReport,
  setCachedReport,
} from '@/lib/googleAnalytics';

function parseDateRange(range, customStart, customEnd) {
  const formatYMD = (d) => d.toISOString().split('T')[0];

  if (range === 'today') {
    return {
      startDate: 'today',
      endDate: 'today',
      prevStartDate: 'yesterday',
      prevEndDate: 'yesterday',
      label: 'Today',
    };
  }

  if (range === 'yesterday') {
    return {
      startDate: 'yesterday',
      endDate: 'yesterday',
      prevStartDate: '2daysAgo',
      prevEndDate: '2daysAgo',
      label: 'Yesterday',
    };
  }

  if (range === '30d') {
    return {
      startDate: '30daysAgo',
      endDate: 'today',
      prevStartDate: '60daysAgo',
      prevEndDate: '31daysAgo',
      label: 'Last 30 Days',
    };
  }

  if (range === '90d') {
    return {
      startDate: '90daysAgo',
      endDate: 'today',
      prevStartDate: '180daysAgo',
      prevEndDate: '91daysAgo',
      label: 'Last 90 Days',
    };
  }

  if (range === 'custom' && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      const prevStart = new Date(prevEnd.getTime() - (diffDays - 1) * 24 * 60 * 60 * 1000);

      return {
        startDate: formatYMD(start),
        endDate: formatYMD(end),
        prevStartDate: formatYMD(prevStart),
        prevEndDate: formatYMD(prevEnd),
        label: `${formatYMD(start)} to ${formatYMD(end)}`,
      };
    }
  }

  // Default: last 7 days
  return {
    startDate: '7daysAgo',
    endDate: 'today',
    prevStartDate: '14daysAgo',
    prevEndDate: '8daysAgo',
    label: 'Last 7 Days',
  };
}

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
        message: 'Google Analytics Data API credentials are not configured.',
        missingCredentials: config.missing,
        instruction:
          'Set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY in your server environment variables.',
      },
      { status: 200 }
    );
  }

  // 3. Parse query parameters
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '7d';
  const customStart = searchParams.get('startDate');
  const customEnd = searchParams.get('endDate');

  const dateConfig = parseDateRange(range, customStart, customEnd);
  const cacheKey = `analytics_${range}_${dateConfig.startDate}_${dateConfig.endDate}`;

  // Check cache (5 min TTL)
  const cachedData = getCachedReport(cacheKey);
  if (cachedData) {
    return NextResponse.json(
      {
        configured: true,
        cached: true,
        ...cachedData,
      },
      { status: 200 }
    );
  }

  try {
    const client = getAnalyticsDataClient();
    const property = `properties/${config.propertyId}`;

    // Execute queries in parallel using Promise.all for high performance
    const [
      overviewReport,
      dailyTrendReport,
      topPagesReport,
      channelsReport,
      devicesReport,
      browsersReport,
      osReport,
      countriesReport,
      citiesReport,
    ] = await Promise.all([
      // 1. Overview Comparison (Current vs Previous period)
      client.runReport({
        property,
        dateRanges: [
          { name: 'current', startDate: dateConfig.startDate, endDate: dateConfig.endDate },
          { name: 'previous', startDate: dateConfig.prevStartDate, endDate: dateConfig.prevEndDate },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),

      // 2. Daily Visitor & Pageviews Trend
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'newUsers' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date', orderType: 'ALPHANUMERIC' }, desc: false }],
      }),

      // 3. Top Visited Pages
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // 4. Traffic Acquisition Channels
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 5. Device Categories
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),

      // 6. Browser Breakdown
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'browser' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 6,
      }),

      // 7. Operating System Breakdown
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'operatingSystem' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 6,
      }),

      // 8. Geographic Distribution (Countries)
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      }),

      // 9. City Breakdown (for Bangladesh and worldwide)
      client.runReport({
        property,
        dateRanges: [{ startDate: dateConfig.startDate, endDate: dateConfig.endDate }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 30,
      }),
    ]);

    // Parse Overview report
    let currentMetrics = {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      screenPageViews: 0,
      sessions: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
    };
    let previousMetrics = { ...currentMetrics };

    if (overviewReport[0]?.rows) {
      overviewReport[0].rows.forEach((row) => {
        const rangeIndex = row.dimensionValues?.[0]?.value || '0';
        const vals = {
          totalUsers: Number(row.metricValues?.[0]?.value || 0),
          activeUsers: Number(row.metricValues?.[1]?.value || 0),
          newUsers: Number(row.metricValues?.[2]?.value || 0),
          screenPageViews: Number(row.metricValues?.[3]?.value || 0),
          sessions: Number(row.metricValues?.[4]?.value || 0),
          averageSessionDuration: Math.round(Number(row.metricValues?.[5]?.value || 0)),
          bounceRate: Math.round(Number(row.metricValues?.[6]?.value || 0) * 100) / 100,
        };

        if (rangeIndex === '0' || rangeIndex === 'current') {
          currentMetrics = vals;
        } else {
          previousMetrics = vals;
        }
      });
    }

    const calcChange = (curr, prev) => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const overview = {
      totalUsers: {
        value: currentMetrics.totalUsers,
        previous: previousMetrics.totalUsers,
        change: calcChange(currentMetrics.totalUsers, previousMetrics.totalUsers),
      },
      activeUsers: {
        value: currentMetrics.activeUsers,
        previous: previousMetrics.activeUsers,
        change: calcChange(currentMetrics.activeUsers, previousMetrics.activeUsers),
      },
      newUsers: {
        value: currentMetrics.newUsers,
        previous: previousMetrics.newUsers,
        change: calcChange(currentMetrics.newUsers, previousMetrics.newUsers),
      },
      screenPageViews: {
        value: currentMetrics.screenPageViews,
        previous: previousMetrics.screenPageViews,
        change: calcChange(currentMetrics.screenPageViews, previousMetrics.screenPageViews),
      },
      sessions: {
        value: currentMetrics.sessions,
        previous: previousMetrics.sessions,
        change: calcChange(currentMetrics.sessions, previousMetrics.sessions),
      },
      averageSessionDuration: {
        value: currentMetrics.averageSessionDuration,
        previous: previousMetrics.averageSessionDuration,
        change: calcChange(
          currentMetrics.averageSessionDuration,
          previousMetrics.averageSessionDuration
        ),
      },
      bounceRate: {
        value: currentMetrics.bounceRate,
        previous: previousMetrics.bounceRate,
        change: calcChange(currentMetrics.bounceRate, previousMetrics.bounceRate),
      },
    };

    // Format daily trend
    const dailyTrend = (dailyTrendReport[0]?.rows || []).map((row) => {
      const rawDate = row.dimensionValues?.[0]?.value || '';
      let formatted = rawDate;
      if (rawDate.length === 8) {
        const year = rawDate.substring(0, 4);
        const month = rawDate.substring(4, 6);
        const day = rawDate.substring(6, 8);
        const d = new Date(`${year}-${month}-${day}T00:00:00Z`);
        formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      }

      const activeUsers = Number(row.metricValues?.[0]?.value || 0);
      const newUsers = Number(row.metricValues?.[3]?.value || 0);
      const returningUsers = Math.max(0, activeUsers - newUsers);

      return {
        date: formatted,
        rawDate,
        activeUsers,
        screenPageViews: Number(row.metricValues?.[1]?.value || 0),
        sessions: Number(row.metricValues?.[2]?.value || 0),
        newUsers,
        returningUsers,
      };
    });

    // Format top pages
    const topPages = (topPagesReport[0]?.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || '(not set)',
      views: Number(row.metricValues?.[0]?.value || 0),
      users: Number(row.metricValues?.[1]?.value || 0),
      avgDuration: Math.round(Number(row.metricValues?.[2]?.value || 0)),
    }));

    // Format channels
    const totalChannelSessions = (channelsReport[0]?.rows || []).reduce(
      (sum, r) => sum + Number(r.metricValues?.[1]?.value || 0),
      0
    );
    const channels = (channelsReport[0]?.rows || []).map((row) => {
      const sessions = Number(row.metricValues?.[1]?.value || 0);
      const percentage =
        totalChannelSessions > 0 ? Math.round((sessions / totalChannelSessions) * 100) : 0;
      return {
        channel: row.dimensionValues?.[0]?.value || 'Other',
        users: Number(row.metricValues?.[0]?.value || 0),
        sessions,
        percentage,
      };
    });

    // Format devices
    const totalDeviceUsers = (devicesReport[0]?.rows || []).reduce(
      (sum, r) => sum + Number(r.metricValues?.[0]?.value || 0),
      0
    );
    const devices = (devicesReport[0]?.rows || []).map((row) => {
      const users = Number(row.metricValues?.[0]?.value || 0);
      const percentage = totalDeviceUsers > 0 ? Math.round((users / totalDeviceUsers) * 100) : 0;
      return {
        category: row.dimensionValues?.[0]?.value || 'Unknown',
        users,
        sessions: Number(row.metricValues?.[1]?.value || 0),
        percentage,
      };
    });

    // Format browsers & OS
    const browsers = (browsersReport[0]?.rows || []).map((row) => ({
      browser: row.dimensionValues?.[0]?.value || 'Unknown',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    const operatingSystems = (osReport[0]?.rows || []).map((row) => ({
      os: row.dimensionValues?.[0]?.value || 'Unknown',
      users: Number(row.metricValues?.[0]?.value || 0),
    }));

    // Format countries & Bangladesh-specific analytics
    const totalCountryUsers = (countriesReport[0]?.rows || []).reduce(
      (sum, r) => sum + Number(r.metricValues?.[0]?.value || 0),
      0
    );

    const countries = (countriesReport[0]?.rows || []).map((row) => {
      const users = Number(row.metricValues?.[0]?.value || 0);
      const percentage =
        totalCountryUsers > 0 ? Math.round((users / totalCountryUsers) * 100) : 0;
      return {
        country: row.dimensionValues?.[0]?.value || '(not set)',
        users,
        views: Number(row.metricValues?.[1]?.value || 0),
        percentage,
      };
    });

    // Specifically extract Bangladesh traffic & city distribution
    const bdCountryRow = countries.find((c) => c.country.toLowerCase() === 'bangladesh');
    const bdUsers = bdCountryRow?.users || 0;
    const bdViews = bdCountryRow?.views || 0;
    const bdPercentage =
      totalCountryUsers > 0 ? Math.round((bdUsers / totalCountryUsers) * 100) : 0;

    const bdCities = (citiesReport[0]?.rows || [])
      .filter((r) => r.dimensionValues?.[0]?.value?.toLowerCase() === 'bangladesh')
      .map((r) => {
        const city = r.dimensionValues?.[1]?.value || '(not set)';
        const users = Number(r.metricValues?.[0]?.value || 0);
        const cityPercentage = bdUsers > 0 ? Math.round((users / bdUsers) * 100) : 0;
        return {
          city: city === '(not set)' ? 'Unknown City' : city,
          users,
          views: Number(r.metricValues?.[1]?.value || 0),
          percentage: cityPercentage,
        };
      })
      .slice(0, 8);

    const bangladeshAnalytics = {
      users: bdUsers,
      views: bdViews,
      percentage: bdPercentage,
      cities: bdCities,
    };

    const responsePayload = {
      configured: true,
      cached: false,
      dateRange: dateConfig,
      overview,
      dailyTrend,
      topPages,
      channels,
      devices,
      browsers,
      operatingSystems,
      countries,
      bangladeshAnalytics,
      fetchedAt: new Date().toISOString(),
    };

    // Cache the response
    setCachedReport(cacheKey, responsePayload);

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('GA4 Data API Error:', error);

    const isPermissionDenied =
      error?.message?.includes('User does not have sufficient permissions') ||
      error?.message?.includes('7 PERMISSION_DENIED');

    return NextResponse.json(
      {
        configured: true,
        error: true,
        permissionDenied: isPermissionDenied,
        message: isPermissionDenied
          ? `The Google Cloud Service Account (${config.clientEmail}) does not have Viewer permissions for GA4 Property (${config.propertyId}). In Google Analytics > Admin > Property Settings > Property Access Management, add this email with the Viewer role.`
          : error?.message?.includes('invalid_grant')
          ? 'Invalid Google Cloud Service Account credentials or private key.'
          : 'Failed to retrieve analytics data from Google Analytics Data API.',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: isPermissionDenied ? 403 : 500 }
    );
  }
}
