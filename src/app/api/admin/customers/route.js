import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const profiles = await prisma.customerProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Compute total_orders and total_spent for each customer
    const customersWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const customerOrders = await prisma.order.findMany({
          where: {
            customerEmail: { equals: profile.email, mode: 'insensitive' },
          },
          select: { status: true, totalAmount: true },
        });

        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + (o.totalAmount ? Number(o.totalAmount) : 0), 0);

        return {
          id: Number(profile.id),
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          company: profile.company || '',
          designation: profile.designation || '',
          address: profile.address || '',
          total_orders: totalOrders,
          total_spent: Math.round(totalSpent * 100) / 100,
          created_at: profile.createdAt,
        };
      })
    );

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Customers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
