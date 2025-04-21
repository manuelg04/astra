import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function currentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;
  if (!token) return null;

  try {
    const { sub } = verifyToken(token);
    return db.user.findUnique({ where: { id: sub } });
  } catch {
    return null;
  }
}