import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getAuthUser } from '@/lib/auth';

export function formatFAQ(f) {
  return {
    id: Number(f.id),
    question: f.question,
    answer: f.answer,
    category: f.category,
    is_active: f.isActive,
    display_order: f.displayOrder,
    created_at: f.createdAt,
  };
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const isAdmin = user && (user.is_staff || user.is_superuser || ['ADMIN', 'STAFF'].includes(user.role));

    const faqs = await prisma.fAQ.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
    });

    return NextResponse.json(faqs.map(formatFAQ));
  } catch (error) {
    console.error('FAQs GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const data = await request.json();

    const question = data.question;
    const answer = data.answer;
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }

    const created = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: data.category || 'General',
        isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
        displayOrder: data.display_order != null ? Number(data.display_order) : 0,
      },
    });

    return NextResponse.json(formatFAQ(created), { status: 201 });
  } catch (error) {
    console.error('FAQs POST error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
