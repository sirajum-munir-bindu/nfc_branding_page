import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settingsList = await prisma.siteSetting.findMany();
    const settingsDict = {};

    for (const s of settingsList) {
      settingsDict[s.key] = s.value;
    }

    if (!settingsDict.showcase_video_url) {
      settingsDict.showcase_video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }

    return NextResponse.json(settingsDict);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const data = await request.json();
    const key = (data.key || '').trim();
    const value = (data.value || '').trim();

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({
      key: setting.key,
      value: setting.value,
      message: 'Setting saved successfully',
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
