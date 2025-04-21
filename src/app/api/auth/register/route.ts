import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { normalizeEmail, isEmail } from '@/lib/email';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { email: rawEmail, password } = await req.json();
  const email = normalizeEmail(rawEmail);

  if (!isEmail(email))
    return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });

  try {
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { email, passwordHash },
    });

    const token = signToken({ sub: user.id });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('auth', token, { httpOnly: true, path: '/' });
    return res;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // Violación de UNIQUE
      return NextResponse.json(
        { error: 'El correo ya está registrado.' },
        { status: 409 },
      );
    }
    throw err;
  }
}