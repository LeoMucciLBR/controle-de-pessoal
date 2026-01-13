import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar todas as ordens de serviço (exceto apagadas)
export async function GET() {
  try {
    const ordens = await prisma.ordemServico.findMany({
      where: {
        NOT: { status: 'apagado' }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ordens);
  } catch (error: any) {
    console.error('Erro ao buscar ordens de serviço:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar ordens de serviço',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Criar nova ordem de serviço
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ordem = await prisma.ordemServico.create({
      data: {
        contrato: body.contrato,
        dataContrato: body.dataContrato,
        ordemServico: body.ordemServico,
        dataOrdemServico: body.dataOrdemServico,
        nome: body.nome,
        cliente: body.cliente,
        valorNegociado: parseFloat(body.valorNegociado) || 0,
      },
    });

    return NextResponse.json(ordem, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar ordem de serviço:', error);
    return NextResponse.json({ error: 'Erro ao criar ordem de serviço' }, { status: 500 });
  }
}
