export type PersonStatus = 'ativo' | 'inativo' | 'banco_de_dados' | 'baixa_frequencia';
export type AreaAtuacao = 'rodovia' | 'ferrovia' | 'saneamento' | 'iluminacao_publica' | 'edificacao';
export type Contrato = 'EIXO 1' | 'ENTREVIAS' | 'ECOPISTAS' | 'ECORIOMINAS' | 'CONTRATO GLOBAL';
export type Disciplina = 'PROJETO' | 'OBRA';

export interface Person {
  id: number;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  endereco?: string;
  cargo: string;
  formacao?: string;
  
  status: PersonStatus;
  
  // Contato
  email: string;
  telefone: string;
  
  // Empresa e Contrato
  empresa: string;
  contrato: Contrato; // Contrato atual/principal
  contratosAtivos?: string[]; // Checkbox dos contratos (EIXO 1, ENTREVIAS, etc)
  dataAdmissao?: string;
  vigenciaInicio?: string;
  vigenciaFim?: string;
  termoConfidencialidade?: boolean;

  // Documentação PJ
  apresentouCartaoCnpj?: boolean; // "APRESENTOU CARTÃO CNPJ/ REQUERIMENTO DO EMPRESÁRIO/ CONTRATO SOCIAL?"
  numeroCnpj?: string;
  
  // Conselho de Classe
  conselhoClasse?: string;
  anoRegistroConselho?: number;
  numeroRegistroConselho?: string;
  certidaoQuitacaoPf?: boolean; // "CERTIDÃO DE REGISTRO E QUITAÇÃO DE PESSOA FÍSICA..."
  certidaoQuitacaoPj?: boolean; // "CERTIDÃO DE REGISTRO DE QUITAÇÃO (CRQ/CAU/CFT)"

  // Profissional
  curriculo?: boolean; // Tem currículo?
  historicoProfissional?: string; // Texto
  treinamentos?: string[];

  // Áreas (Flags gerais)
  areas: AreaAtuacao[]; // RODOVIA, FERROVIA, SANEAMENTO, ILUMINAÇÃO, EDIFICAÇÃO

  // Disciplinas Detalhadas
  disciplina: Disciplina; // Tipo principal (PROJETO ou OBRA)
  competencias: string[]; // Manter como tags genéricas ou migrar para as específicas abaixo
  
  disciplinasProjeto?: string[]; // AR CONDICIONADO, ARQUITETURA, AUTOMAÇÃO, BIM, etc.
  disciplinasObra?: string[]; // PLANEJAMENTO, AUTOMACAO, FISCALIZACAO, ETC.
}

export interface FilterState {
  search: string;
  status: PersonStatus | 'all';
  empresa: string;
  areas: AreaAtuacao[];
  contrato: Contrato | 'all';
  disciplina: Disciplina | 'all';
}
