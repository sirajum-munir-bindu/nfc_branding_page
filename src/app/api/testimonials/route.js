import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import { getDirectImageUrl } from '@/utils/imageUtils';

export function formatTestimonial(t) {
  return {
    id: Number(t.id),
    name: t.name,
    designation: t.designation,
    company: t.company,
    avatar: t.avatar,
    avatar_url: t.avatarUrl ? getDirectImageUrl(t.avatarUrl) : null,
    rating: t.rating,
    review: t.review,
    is_active: t.isActive,
    display_order: t.displayOrder,
    created_at: t.createdAt,
  };
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const isAdmin = user && (user.is_staff || user.is_superuser || ['ADMIN', 'STAFF'].includes(user.role));

    const testimonials = await prisma.testimonial.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(testimonials.map(formatTestimonial));
  } catch (error) {
    console.error('Testimonials GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const data = await request.json();

    const name = data.name;
    const review = data.review;
    if (!name || !review) {
      return NextResponse.json({ error: 'Name and review are required.' }, { status: 400 });
    }

    const created = await prisma.testimonial.create({
      data: {
        name,
        designation: data.designation || '',
        company: data.company || '',
        avatarUrl: data.avatar_url ? getDirectImageUrl(data.avatar_url) : null,
        rating: data.rating != null ? Number(data.rating) : 5,
        review,
        isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
        displayOrder: data.display_order != null ? Number(data.display_order) : 0,
      },
    });

    return NextResponse.json(formatTestimonial(created), { status: 201 });
  } catch (error) {
    console.error('Testimonials POST error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
