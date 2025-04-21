import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

/**
 * Rutas que requieren usuario autenticado.
 * Añade aquí cualquier prefijo que quieras proteger: ejemplo '/settings'
 */
const PROTECTED = ['/dashboard'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ¿La ruta está protegida?
  const secure = PROTECTED.some((p) => pathname.startsWith(p));
  if (!secure) return NextResponse.next();

  // 1. Leer cookie
  const token = req.cookies.get('auth')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Verificar firma / expiración
  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    // Token inválido o expirado
    const res = NextResponse.redirect(new URL('/login', req.url));
    // Limpia la cookie corrupta
    res.cookies.set('auth', '', { path: '/', maxAge: 0 });
    return res;
  }
}

export const config = {
  // Matcher de Middleware: incluye todas las rutas protegidas
  matcher: PROTECTED,
};