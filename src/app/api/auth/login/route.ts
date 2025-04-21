import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash)))
    return NextResponse.json(
      { error: 'Credenciales inválidas.' },
      { status: 401 },
    );

  const token = signToken({ sub: user.id });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth', token, { httpOnly: true, path: '/' });

  return res;
}