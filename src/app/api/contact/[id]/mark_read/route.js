import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    const updated = await prisma.contactMessage.update({
      where: { id: BigInt(numId) },
      data: { isRead: true },
    });

    return NextResponse.json({
      status: 'Message marked as read',
      is_read: true,
      id: Number(updated.id),
    });
  } catch (error) {
    console.error('Contact mark_read error:', error);
    return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 });
  }
}
