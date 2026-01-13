import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar pessoa por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const person = await prisma.person.findUnique({
      where: { id: parseInt(id) },
    });

    if (!person) {
      return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error('Erro ao buscar pessoa:', error);
    return NextResponse.json({ error: 'Erro ao buscar pessoa' }, { status: 500 });
  }
}

// PUT - Atualizar pessoa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const person = await prisma.person.update({
      where: { id: parseInt(id) },
      data: {
        nome: body.nome,
        cpf: body.cpf,
        rg: body.rg || null,
        dataNascimento: body.dataNascimento || null,
        endereco: body.endereco || null,
        cargo: body.cargo,
        formacao: body.formacao || null,
        status: body.status,
        email: body.email,
        telefone: body.telefone,
        empresa: body.empresa,
        contrato: body.contrato,
        contratosAtivos: body.contratosAtivos || [],
        dataAdmissao: body.dataAdmissao || null,
        vigenciaInicio: body.vigenciaInicio || null,
        vigenciaFim: body.vigenciaFim || null,
        termoConfidencialidade: body.termoConfidencialidade || false,
        apresentouCartaoCnpj: body.apresentouCartaoCnpj || false,
        numeroCnpj: body.numeroCnpj || null,
        conselhoClasse: body.conselhoClasse || null,
        anoRegistroConselho: body.anoRegistroConselho || null,
        numeroRegistroConselho: body.numeroRegistroConselho || null,
        certidaoQuitacaoPf: body.certidaoQuitacaoPf || false,
        certidaoQuitacaoPj: body.certidaoQuitacaoPj || false,
        curriculo: body.curriculo || false,
        historicoProfissional: body.historicoProfissional || null,
        treinamentos: body.treinamentos || [],
        areas: body.areas || [],
        disciplina: body.disciplina,
        competencias: body.competencias || [],
        disciplinasProjeto: body.disciplinasProjeto || [],
        disciplinasObra: body.disciplinasObra || [],
      },
    });

    return NextResponse.json(person);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 });
    }
    console.error('Erro ao atualizar pessoa:', error);
    return NextResponse.json({ error: 'Erro ao atualizar pessoa' }, { status: 500 });
  }
}

// DELETE - Soft delete (marca como apagado, não remove do banco)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Soft delete: marca como 'apagado' ao invés de deletar
    await prisma.person.update({
      where: { id: parseInt(id) },
      data: { status: 'apagado' },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Pessoa não encontrada' }, { status: 404 });
    }
    console.error('Erro ao deletar pessoa:', error);
    return NextResponse.json({ error: 'Erro ao deletar pessoa' }, { status: 500 });
  }
}
