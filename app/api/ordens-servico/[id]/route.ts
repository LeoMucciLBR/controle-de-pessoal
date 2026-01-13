import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar ordem por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ordem = await prisma.ordemServico.findUnique({
      where: { id: parseInt(id) },
    });

    if (!ordem) {
      return NextResponse.json({ error: 'Ordem de serviço não encontrada' }, { status: 404 });
    }

    return NextResponse.json(ordem);
  } catch (error) {
    console.error('Erro ao buscar ordem de serviço:', error);
    return NextResponse.json({ error: 'Erro ao buscar ordem de serviço' }, { status: 500 });
  }
}

// PUT - Atualizar ordem de serviço
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const ordem = await prisma.ordemServico.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(ordem);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Ordem de serviço não encontrada' }, { status: 404 });
    }
    console.error('Erro ao atualizar ordem de serviço:', error);
    return NextResponse.json({ error: 'Erro ao atualizar ordem de serviço' }, { status: 500 });
  }
}

// DELETE - Soft delete (marca como apagado)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.ordemServico.update({
      where: { id: parseInt(id) },
      data: { status: 'apagado' },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Ordem de serviço não encontrada' }, { status: 404 });
    }
    console.error('Erro ao deletar ordem de serviço:', error);
    return NextResponse.json({ error: 'Erro ao deletar ordem de serviço' }, { status: 500 });
  }
}
