import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, getAuthUser } from '@/lib/auth';

export function formatCardDesign(cd) {
  return {
    id: Number(cd.id),
    name: cd.name,
    edition_code: cd.editionCode,
    description: cd.description || '',
    price: cd.price != null ? Number(cd.price) : 599.0,
    primary_color: cd.primaryColor,
    accent_color: cd.accentColor,
    texture_type: cd.textureType,
    preview_image: cd.previewImage,
    features: Array.isArray(cd.features) ? cd.features : [],
    is_active: cd.isActive,
    display_order: cd.displayOrder,
    created_at: cd.createdAt,
    updated_at: cd.updatedAt,
  };
}

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const isAdmin = user && (user.is_staff || user.is_superuser || ['ADMIN', 'STAFF'].includes(user.role));

    const cardDesigns = await prisma.cardDesign.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
    });

    return NextResponse.json(cardDesigns.map(formatCardDesign));
  } catch (error) {
    console.error('CardDesigns GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch card designs' }, { status: 500 });
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

    let editionCode = data.edition_code;
    if (!editionCode) {
      const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'edition';
      editionCode = base;
      let counter = 1;
      while (await prisma.cardDesign.findUnique({ where: { editionCode } })) {
        editionCode = `${base}-${counter++}`;
      }
    }

    const created = await prisma.cardDesign.create({
      data: {
        name,
        editionCode,
        description: data.description || '',
        price: data.price != null ? Number(data.price) : 599.0,
        primaryColor: data.primary_color || '#0b0f19',
        accentColor: data.accent_color || '#38bdf8',
        textureType: data.texture_type || 'matte-metallic',
        features: Array.isArray(data.features) ? data.features : [],
        isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
        displayOrder: data.display_order != null ? Number(data.display_order) : 0,
      },
    });

    return NextResponse.json(formatCardDesign(created), { status: 201 });
  } catch (error) {
    console.error('CardDesigns POST error:', error);
    return NextResponse.json({ error: 'Failed to create card design' }, { status: 500 });
  }
}
