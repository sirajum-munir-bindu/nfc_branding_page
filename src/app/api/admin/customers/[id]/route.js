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

    const customer = await prisma.customerProfile.findUnique({
      where: { id: BigInt(numId) },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const userId = customer.userId;
    await prisma.customerProfile.delete({
      where: { id: BigInt(numId) },
    });

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.role === 'CUSTOMER') {
        await prisma.user.delete({ where: { id: userId } });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Customer DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
