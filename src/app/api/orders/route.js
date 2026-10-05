import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export function formatOrder(o) {
  return {
    id: Number(o.id),
    order_number: o.orderNumber,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    customer_phone: o.customerPhone,
    shipping_address: o.shippingAddress,
    total_amount: o.totalAmount != null ? Number(o.totalAmount) : 0,
    status: o.status,
    payment_status: o.paymentStatus,
    notes: o.notes || '',
    items: (o.items || []).map((it) => ({
      id: Number(it.id),
      product: it.productId ? Number(it.productId) : null,
      product_name: it.productName,
      quantity: it.quantity,
      unit_price: it.unitPrice != null ? Number(it.unitPrice) : 0,
      customization_data: it.customizationData || {},
      total_price: (it.quantity || 1) * (it.unitPrice != null ? Number(it.unitPrice) : 0),
    })),
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ detail: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search') || '';

    const where = {};
    if (statusParam && statusParam !== 'All') {
      where.status = { equals: statusParam, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders.map(formatOrder));
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const customerName = data.customer_name;
    const customerEmail = data.customer_email;
    const customerPhone = data.customer_phone;
    const shippingAddress = data.shipping_address;
    const notes = data.notes || '';
    const productId = data.product_id ? parseInt(data.product_id, 10) : null;
    const quantity = Math.max(1, parseInt(data.quantity || 1, 10));
    const customization = data.customization_data || {};

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: 'Please provide all required customer fields.' },
        { status: 400 }
      );
    }

    let unitPrice = 599.0;
    let productName = 'Custom NFC Smart Card';
    let dbProduct = null;

    if (productId) {
      try {
        dbProduct = await prisma.product.findUnique({
          where: { id: BigInt(productId) },
        });
        if (dbProduct) {
          productName = dbProduct.name;
          const isVip = customization.package_tier === 'VIP';
          const reg = dbProduct.regularPrice ? Number(dbProduct.regularPrice) : Number(dbProduct.price);
          if (isVip) {
            unitPrice = dbProduct.vipPrice ? Number(dbProduct.vipPrice) : reg + 300;
          } else {
            unitPrice = dbProduct.discountPrice && Number(dbProduct.discountPrice) > 0 ? Number(dbProduct.discountPrice) : reg;
          }
        }
      } catch (err) {
        console.error('Error finding product:', err);
      }
    } else if (customization.edition) {
      productName = `TapCard ${customization.edition} Edition`;
    }

    const courierFee = customization.courier_fee ? parseFloat(customization.courier_fee) : 60.0;
    const totalAmount = unitPrice * quantity + courierFee;
    const trxId = customization.trx_id ? String(customization.trx_id).trim() : '';
    const paymentStatus = trxId && trxId.length > 4 ? 'Paid' : 'Pending';

    // Generate unique order number e.g. TC-A1B2C3
    let orderNumber = `TC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    while (await prisma.order.findUnique({ where: { orderNumber } })) {
      orderNumber = `TC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalAmount,
        notes,
        status: 'Pending',
        paymentStatus,
        items: {
          create: {
            productId: dbProduct ? dbProduct.id : null,
            productName,
            quantity,
            unitPrice,
            customizationData: customization,
          },
        },
      },
      include: { items: true },
    });

    // Upsert CustomerProfile
    try {
      const existingProfile = await prisma.customerProfile.findFirst({
        where: { email: { equals: customerEmail, mode: 'insensitive' } },
      });

      if (existingProfile) {
        await prisma.customerProfile.update({
          where: { id: existingProfile.id },
          data: {
            name: customerName,
            phone: customerPhone,
            address: shippingAddress,
            company: customization.company || existingProfile.company,
            designation: customization.designation || existingProfile.designation,
          },
        });
      } else {
        await prisma.customerProfile.create({
          data: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: shippingAddress,
            company: customization.company || '',
            designation: customization.designation || '',
          },
        });
      }
    } catch (profErr) {
      console.warn('CustomerProfile upsert warning:', profErr);
    }

    return NextResponse.json(formatOrder(order), { status: 201 });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
