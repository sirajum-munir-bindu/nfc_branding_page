import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatProduct } from '../route';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: BigInt(numId) },
    });

    if (!product) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatProduct(product));
  } catch (error) {
    console.error('Product GET [id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
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
    if (data.edition !== undefined) updateData.edition = data.edition;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image_url !== undefined) updateData.imageUrl = data.image_url;
    if (data.back_image_url !== undefined) updateData.backImageUrl = data.back_image_url;
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.is_active !== undefined) updateData.isActive = Boolean(data.is_active);
    if (data.color_hex !== undefined) updateData.colorHex = data.color_hex;
    if (data.finish !== undefined) updateData.finish = data.finish;
    if (data.badge_text !== undefined) updateData.badgeText = data.badge_text;
    if (data.features !== undefined) updateData.features = Array.isArray(data.features) ? data.features : [];
    if (data.display_order !== undefined) updateData.displayOrder = Number(data.display_order);

    if (data.regular_price !== undefined || data.price !== undefined) {
      const reg = data.regular_price != null ? Number(data.regular_price) : Number(data.price);
      updateData.regularPrice = reg;
      updateData.price = reg;
    }
    if (data.vip_price !== undefined) {
      updateData.vipPrice = data.vip_price != null ? Number(data.vip_price) : null;
    }
    if (data.discount_price !== undefined) {
      updateData.discountPrice = data.discount_price != null && data.discount_price !== '' ? Number(data.discount_price) : null;
    }

    const updated = await prisma.product.update({
      where: { id: BigInt(numId) },
      data: updateData,
    });

    return NextResponse.json(formatProduct(updated));
  } catch (error) {
    console.error('Product PATCH [id] error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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

    await prisma.product.delete({
      where: { id: BigInt(numId) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Product DELETE [id] error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
