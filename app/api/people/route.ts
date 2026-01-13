import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar todas as pessoas
export async function GET() {
  try {
    const people = await prisma.person.findMany({
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(people);
  } catch (error: any) {
    console.error('Erro ao buscar pessoas:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar pessoas',
      details: error?.message || 'Unknown error',
      code: error?.code || 'UNKNOWN'
    }, { status: 500 });
  }
}

// POST - Criar nova pessoa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const person = await prisma.person.create({
      data: {
        nome: body.nome,
        cpf: body.cpf,
        rg: body.rg || null,
        dataNascimento: body.dataNascimento || null,
        endereco: body.endereco || null,
        cargo: body.cargo,
        formacao: body.formacao || null,
        status: body.status || 'ativo',
        email: body.email,
        telefone: body.telefone,
        empresa: body.empresa,
        contrato: body.contrato || 'CONTRATO GLOBAL',
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
        disciplina: body.disciplina || 'PROJETO',
        competencias: body.competencias || [],
        disciplinasProjeto: body.disciplinasProjeto || [],
        disciplinasObra: body.disciplinasObra || [],
      },
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 409 });
    }
    console.error('Erro ao criar pessoa:', error);
    return NextResponse.json({ error: 'Erro ao criar pessoa' }, { status: 500 });
  }
}
