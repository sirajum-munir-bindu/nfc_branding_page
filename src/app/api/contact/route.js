import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export function formatMessage(m) {
  return {
    id: Number(m.id),
    name: m.name,
    email: m.email,
    phone: m.phone || '',
    message: m.message,
    is_read: m.isRead,
    created_at: m.createdAt,
  };
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages.map(formatMessage));
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const name = data.name;
    const email = data.email;
    const message = data.message;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const created = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: data.phone || '',
        message,
        isRead: false,
      },
    });

    return NextResponse.json(formatMessage(created), { status: 201 });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
