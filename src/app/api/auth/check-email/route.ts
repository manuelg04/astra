import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeEmail, isEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const { email: rawEmail } = await req.json();
  const email = normalizeEmail(rawEmail);

  if (!isEmail(email))
    return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });

  const exists = !!(await db.user.findUnique({ where: { email } }));
  return NextResponse.json({ exists });
}