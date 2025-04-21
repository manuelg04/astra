import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;
  if (!token) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });

  const { sub } = verifyToken(token);

  const form = await req.formData();
  const name  = form.get('name')  as string;
  const phone = form.get('phone') as string;
  const image = form.get('image') as File | null;

  let imageUrl: string | undefined;

  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.type.split('/')[1] ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;

    // directorio local-images (raíz). Se crea si no existe.
    const dirPath  = path.join(process.cwd(), 'local-images');
    await mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, fileName);
    await writeFile(filePath, buffer);

    imageUrl = `local-images/${fileName}`;
  }

  await db.user.update({
    where: { id: sub },
    data: { name, phone, imageUrl, countryCode: phone?.split(' ')[0] },
  });

  return NextResponse.json({ ok: true });
}