import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;
    const userId = request.cookies.get('user_id')?.value;
    
    if (!sessionToken || !userId) {
      return NextResponse.json({ user: null });
    }
    
    // Busca usuário pelo ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return NextResponse.json({ user: null });
  }
}
