import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getDirectImageUrl } from '@/utils/imageUtils';
import { formatTestimonial } from '../route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const item = await prisma.testimonial.findUnique({
      where: { id: BigInt(numId) },
    });

    if (!item) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatTestimonial(item));
  } catch (error) {
    console.error('Testimonial GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
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
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.avatar_url !== undefined) {
      updateData.avatarUrl = data.avatar_url ? getDirectImageUrl(data.avatar_url) : null;
    }
    if (data.rating !== undefined) updateData.rating = Number(data.rating);
    if (data.review !== undefined) updateData.review = data.review;
    if (data.is_active !== undefined) updateData.isActive = Boolean(data.is_active);
    if (data.display_order !== undefined) updateData.displayOrder = Number(data.display_order);

    const updated = await prisma.testimonial.update({
      where: { id: BigInt(numId) },
      data: updateData,
    });

    return NextResponse.json(formatTestimonial(updated));
  } catch (error) {
    console.error('Testimonial PATCH [id] error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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

    await prisma.testimonial.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Testimonial DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
