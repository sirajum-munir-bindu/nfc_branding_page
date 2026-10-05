import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatOrder } from '../route';

export async function GET(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id: BigInt(numId) },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatOrder(order));
  } catch (error) {
    console.error('Order GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
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
    if (data.status !== undefined) updateData.status = data.status;
    if (data.payment_status !== undefined) updateData.paymentStatus = data.payment_status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.shipping_address !== undefined) updateData.shippingAddress = data.shipping_address;
    if (data.customer_phone !== undefined) updateData.customerPhone = data.customer_phone;
    if (data.customer_name !== undefined) updateData.customerName = data.customer_name;

    const updated = await prisma.order.update({
      where: { id: BigInt(numId) },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json(formatOrder(updated));
  } catch (error) {
    console.error('Order PATCH [id] error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
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

    await prisma.order.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Order DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
