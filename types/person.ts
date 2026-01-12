export type PersonStatus = 'ativo' | 'inativo' | 'banco_de_dados' | 'baixa_frequencia';
export type AreaAtuacao = 'rodovia' | 'ferrovia' | 'saneamento' | 'iluminacao_publica' | 'edificacao';
export type Contrato = 'EIXO 1' | 'ENTREVIAS' | 'ECOPISTAS' | 'ECORIOMINAS' | 'CONTRATO GLOBAL';
export type Disciplina = 'PROJETO' | 'OBRA';

export interface Person {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  status: PersonStatus;
  empresa: string;
  contrato: Contrato;
  email: string;
  telefone: string;
  areas: AreaAtuacao[];
  disciplina: Disciplina;
  competencias: string[];
  dataAdmissao?: string;
}

export interface FilterState {
  search: string;
  status: PersonStatus | 'all';
  empresa: string;
  areas: AreaAtuacao[];
  contrato: Contrato | 'all';
  disciplina: Disciplina | 'all';
}
