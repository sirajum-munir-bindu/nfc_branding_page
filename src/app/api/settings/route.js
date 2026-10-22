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

    if (settingsDict.demo_profile_url === undefined) {
      settingsDict.demo_profile_url = '';
    }

    // Notice defaults
    if (settingsDict.notice_enabled === undefined) {
      settingsDict.notice_enabled = 'false';
    }
    if (settingsDict.notice_badge === undefined) {
      settingsDict.notice_badge = 'SPECIAL ANNOUNCEMENT';
    }
    if (settingsDict.notice_badge_color === undefined) {
      settingsDict.notice_badge_color = 'cyan';
    }
    if (settingsDict.notice_title === undefined) {
      settingsDict.notice_title = '⚡ Get 20% OFF on all Metal & Matte NFC Smart Business Cards!';
    }
    if (settingsDict.notice_message === undefined) {
      settingsDict.notice_message = 'Order today to enjoy lifetime cloud profile hosting, instant contactless sharing, and free nationwide courier delivery.';
    }
    if (settingsDict.notice_button_text === undefined) {
      settingsDict.notice_button_text = 'Claim Offer Now';
    }
    if (settingsDict.notice_button_url === undefined) {
      settingsDict.notice_button_url = '#cards';
    }
    if (settingsDict.notice_popup_delay === undefined) {
      settingsDict.notice_popup_delay = '1000';
    }
    if (settingsDict.notice_show_top_banner === undefined) {
      settingsDict.notice_show_top_banner = 'true';
    }
    if (settingsDict.notice_show_card === undefined) {
      settingsDict.notice_show_card = 'true';
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

    // Support batch update if `settings` object is provided
    if (data.settings && typeof data.settings === 'object') {
      const operations = [];
      for (const [k, v] of Object.entries(data.settings)) {
        const key = String(k || '').trim();
        const value = String(v ?? '').trim();
        if (key) {
          operations.push(
            prisma.siteSetting.upsert({
              where: { key },
              update: { value },
              create: { key, value },
            })
          );
        }
      }
      await prisma.$transaction(operations);
      return NextResponse.json({
        message: 'Settings updated successfully',
      });
    }

    // Single key-value update fallback
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
