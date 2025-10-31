import { NextRequest, NextResponse } from 'next/server';
import { getWeapons, addWeapon, updateWeapon, deleteWeapon } from '@/lib/store';
import { Weapon } from '@/types';

export async function GET() {
  try {
    const weapons = await getWeapons();
    return NextResponse.json(weapons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weapons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newWeapon: Weapon = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: body.categoryId,
      price: parseFloat(body.price),
      images: body.images || ['/images/weapons/default.jpg'],
      videoUrl: body.videoUrl || '',
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription,
      specifications: body.specifications || {},
    };
    await addWeapon(newWeapon);
    return NextResponse.json(newWeapon, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create weapon' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await updateWeapon(body.id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update weapon' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Weapon ID required' }, { status: 400 });
    }
    await deleteWeapon(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete weapon' }, { status: 500 });
  }
}
