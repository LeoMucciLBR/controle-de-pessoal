import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Schema Zod para validação - proteção contra SQL Injection
const loginSchema = z.object({
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .max(100, 'E-mail muito longo')
    .regex(/^[a-zA-Z0-9._@-]+$/, 'Caracteres inválidos no e-mail'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha muito longa'),
});

// Função para gerar token de sessão seguro
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação com Zod - sanitiza inputs e previne SQL Injection
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    // Busca usuário - Prisma usa queries parametrizadas (seguro contra SQL Injection)
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    
    if (!user) {
      // Delay para prevenir timing attacks
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Verifica se a senha está hashada (começa com $2)
    const isPasswordHashed = user.password.startsWith('$2');
    
    let isPasswordValid: boolean;
    if (isPasswordHashed) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Senha em texto plano (migração legada) - comparação direta
      isPasswordValid = password === user.password;
      
      // Se senha válida, atualiza para hash
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
      }
    }
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Gera token de sessão
    const sessionToken = generateSessionToken();
    
    // Cria resposta com cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
    // Cookie seguro httpOnly
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });
    
    // Armazena o user ID no cookie (para verificação posterior)
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
