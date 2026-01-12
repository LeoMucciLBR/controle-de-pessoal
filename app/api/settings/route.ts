import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar todas as configurações
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Agrupar por categoria
    const grouped = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push({
        value: setting.value,
        label: setting.label || setting.value,
      });
      return acc;
    }, {} as Record<string, { value: string; label: string }[]>);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

// POST - Adicionar nova configuração
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, value, label } = body;

    if (!category || !value) {
      return NextResponse.json({ error: 'Category e value são obrigatórios' }, { status: 400 });
    }

    const setting = await prisma.setting.create({
      data: {
        category,
        value,
        label: label || null,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Item já existe' }, { status: 409 });
    }
    console.error('Erro ao criar configuração:', error);
    return NextResponse.json({ error: 'Erro ao criar configuração' }, { status: 500 });
  }
}

// DELETE - Remover configuração
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const value = searchParams.get('value');

    if (!category || !value) {
      return NextResponse.json({ error: 'Category e value são obrigatórios' }, { status: 400 });
    }

    await prisma.setting.delete({
      where: {
        category_value: { category, value },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar configuração:', error);
    return NextResponse.json({ error: 'Erro ao deletar configuração' }, { status: 500 });
  }
}
