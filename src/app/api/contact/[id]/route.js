import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    await prisma.contactMessage.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Contact DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
