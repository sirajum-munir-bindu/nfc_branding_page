import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getAuthUser } from '@/lib/auth';

export function formatProduct(p) {
  const price = p.price != null ? Number(p.price) : 599.0;
  const regularPrice = p.regularPrice != null ? Number(p.regularPrice) : price;
  const vipPrice = p.vipPrice != null ? Number(p.vipPrice) : regularPrice + 300;
  const discountPrice = p.discountPrice != null ? Number(p.discountPrice) : null;
  const effectivePrice = discountPrice && discountPrice > 0 ? discountPrice : regularPrice;
  const hasDiscount = Boolean(discountPrice && discountPrice > 0 && regularPrice && discountPrice < regularPrice);

  return {
    id: Number(p.id),
    name: p.name,
    slug: p.slug,
    edition: p.edition,
    description: p.description || '',
    price,
    regular_price: regularPrice,
    vip_price: vipPrice,
    discount_price: discountPrice,
    effective_price: effectivePrice,
    has_discount: hasDiscount,
    image: p.image,
    image_url: p.imageUrl || '',
    back_image: p.backImage,
    back_image_url: p.backImageUrl || '',
    stock: p.stock,
    is_active: p.isActive,
    color_hex: p.colorHex,
    finish: p.finish,
    badge_text: p.badgeText || '',
    features: Array.isArray(p.features) ? p.features : [],
    display_order: p.displayOrder,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const user = await getAuthUser(request);
    const isAdmin = user && (user.is_staff || user.is_superuser || ['ADMIN', 'STAFF'].includes(user.role));

    const where = {};
    if (!isAdmin) {
      where.isActive = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { edition: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
    });

    return NextResponse.json(products.map(formatProduct));
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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
    if (!name) {
      return NextResponse.json({ name: ['This field is required.'] }, { status: 400 });
    }

    const regularVal = data.regular_price != null ? Number(data.regular_price) : (data.price != null ? Number(data.price) : 599.0);
    const vipVal = data.vip_price != null ? Number(data.vip_price) : regularVal + 300.0;
    const discountVal = data.discount_price != null && data.discount_price !== '' ? Number(data.discount_price) : null;

    // Generate unique slug
    let baseSlug = (data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'card';
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        edition: data.edition || 'Standard Edition',
        description: data.description || '',
        price: regularVal,
        regularPrice: regularVal,
        vipPrice: vipVal,
        discountPrice: discountVal,
        imageUrl: data.image_url || '',
        backImageUrl: data.back_image_url || '',
        stock: data.stock != null ? Number(data.stock) : 100,
        isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
        colorHex: data.color_hex || '#0f172a',
        finish: data.finish || 'Matte Brushed',
        badgeText: data.badge_text || '',
        features: Array.isArray(data.features) ? data.features : [],
        displayOrder: data.display_order != null ? Number(data.display_order) : 0,
      },
    });

    return NextResponse.json(formatProduct(created), { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
