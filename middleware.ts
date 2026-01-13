import { NextRequest, NextResponse } from 'next/server';

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
];

// Prefixos sempre permitidos
const alwaysAllowedPrefixes = [
  '/_next',
  '/favicon.ico',
  '/logo.png',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permite rotas internas do Next.js e arquivos estáticos
  if (alwaysAllowedPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }
  
  // Permite rotas públicas
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }
  
  // Verifica se existe cookie de sessão
  const sessionToken = request.cookies.get('session_token')?.value;
  const userId = request.cookies.get('user_id')?.value;
  
  // Se não autenticado, redireciona para login
  if (!sessionToken || !userId) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Usuário autenticado, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
