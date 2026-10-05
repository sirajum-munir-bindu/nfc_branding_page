import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatFAQ } from '../route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const item = await prisma.fAQ.findUnique({
      where: { id: BigInt(numId) },
    });

    if (!item) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatFAQ(item));
  } catch (error) {
    console.error('FAQ GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const data = await request.json();

    const updateData = {};
    if (data.question !== undefined) updateData.question = data.question;
    if (data.answer !== undefined) updateData.answer = data.answer;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.is_active !== undefined) updateData.isActive = Boolean(data.is_active);
    if (data.display_order !== undefined) updateData.displayOrder = Number(data.display_order);

    const updated = await prisma.fAQ.update({
      where: { id: BigInt(numId) },
      data: updateData,
    });

    return NextResponse.json(formatFAQ(updated));
  } catch (error) {
    console.error('FAQ PATCH [id] error:', error);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    await prisma.fAQ.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('FAQ DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
