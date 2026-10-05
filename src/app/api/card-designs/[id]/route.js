import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatCardDesign } from '../route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const item = await prisma.cardDesign.findUnique({
      where: { id: BigInt(numId) },
    });

    if (!item) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatCardDesign(item));
  } catch (error) {
    console.error('CardDesign GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch card design' }, { status: 500 });
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
    if (data.name !== undefined) updateData.name = data.name;
    if (data.edition_code !== undefined) updateData.editionCode = data.edition_code;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.primary_color !== undefined) updateData.primaryColor = data.primary_color;
    if (data.accent_color !== undefined) updateData.accentColor = data.accent_color;
    if (data.texture_type !== undefined) updateData.textureType = data.texture_type;
    if (data.features !== undefined) updateData.features = Array.isArray(data.features) ? data.features : [];
    if (data.is_active !== undefined) updateData.isActive = Boolean(data.is_active);
    if (data.display_order !== undefined) updateData.displayOrder = Number(data.display_order);

    const updated = await prisma.cardDesign.update({
      where: { id: BigInt(numId) },
      data: updateData,
    });

    return NextResponse.json(formatCardDesign(updated));
  } catch (error) {
    console.error('CardDesign PATCH [id] error:', error);
    return NextResponse.json({ error: 'Failed to update card design' }, { status: 500 });
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

    await prisma.cardDesign.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('CardDesign DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete card design' }, { status: 500 });
  }
}
