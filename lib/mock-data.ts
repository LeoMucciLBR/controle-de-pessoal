import { Person } from '@/types/person';

export const mockPeople: Person[] = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "123.456.789-00",
    cargo: "Engenheiro Civil Sênior",
    status: "ativo",
    empresa: "EIXO Engenharia",
    contrato: "EIXO 1",
    email: "joao.silva@eixo.com.br",
    telefone: "(11) 98765-4321",
    areas: ["rodovia", "saneamento"],
    disciplina: "PROJETO",
    competencias: ["Projeto de Rodovia", "Obra de Saneamento", "Gestão de Projetos"],
    dataAdmissao: "2020-03-15"
  },
  {
    id: 2,
    nome: "Maria Santos",
    cpf: "987.654.321-00",
    cargo: "Arquiteta Coordenadora",
    status: "ativo",
    empresa: "Entrevias",
    contrato: "ENTREVIAS",
    email: "maria.santos@entrevias.com.br",
    telefone: "(11) 99876-5432",
    areas: ["edificacao"],
    disciplina: "PROJETO",
    competencias: ["Projeto de Edificação", "Design de Interiores"],
    dataAdmissao: "2019-08-20"
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    cpf: "456.789.123-00",
    cargo: "Técnico em Segurança",
    status: "inativo",
    empresa: "Ecopistas",
    contrato: "ECOPISTAS",
    email: "carlos.oliveira@ecopistas.com.br",
    telefone: "(11) 97654-3210",
    areas: ["rodovia", "ferrovia"],
    disciplina: "OBRA",
    competencias: ["Segurança do Trabalho", "Fiscalização de Obra"],
    dataAdmissao: "2021-01-10"
  },
  {
    id: 4,
    nome: "Ana Paula Ferreira",
    cpf: "321.654.987-00",
    cargo: "Gerente de Projetos",
    status: "ativo",
    empresa: "EcoRioMinas",
    contrato: "ECORIOMINAS",
    email: "ana.ferreira@ecoriominas.com.br",
    telefone: "(11) 96543-2109",
    areas: ["saneamento", "iluminacao_publica"],
    disciplina: "PROJETO",
    competencias: ["Gestão de Projetos", "Saneamento Básico", "Iluminação Pública"],
    dataAdmissao: "2018-05-22"
  },
  {
    id: 5,
    nome: "Roberto Lima",
    cpf: "654.987.321-00",
    cargo: "Engenheiro Eletricista",
    status: "banco_de_dados",
    empresa: "EIXO Engenharia",
    contrato: "CONTRATO GLOBAL",
    email: "roberto.lima@eixo.com.br",
    telefone: "(11) 95432-1098",
    areas: ["iluminacao_publica"],
    disciplina: "OBRA",
    competencias: ["Instalações Elétricas", "Iluminação Pública", "Automação"],
    dataAdmissao: "2022-02-14"
  },
  {
    id: 6,
    nome: "Fernanda Costa",
    cpf: "789.123.456-00",
    cargo: "Engenheira Ambiental",
    status: "baixa_frequencia",
    empresa: "Entrevias",
    contrato: "ENTREVIAS",
    email: "fernanda.costa@entrevias.com.br",
    telefone: "(11) 94321-0987",
    areas: ["saneamento", "rodovia"],
    disciplina: "PROJETO",
    competencias: ["Licenciamento Ambiental", "Estudos de Impacto"],
    dataAdmissao: "2020-11-30"
  },
  {
    id: 7,
    nome: "Pedro Henrique Souza",
    cpf: "147.258.369-00",
    cargo: "Mestre de Obras",
    status: "ativo",
    empresa: "Ecopistas",
    contrato: "ECOPISTAS",
    email: "pedro.souza@ecopistas.com.br",
    telefone: "(11) 93210-9876",
    areas: ["rodovia", "ferrovia"],
    disciplina: "OBRA",
    competencias: ["Execução de Obras", "Gestão de Equipes", "Controle de Qualidade"],
    dataAdmissao: "2017-07-08"
  },
  {
    id: 8,
    nome: "Juliana Martins",
    cpf: "258.369.147-00",
    cargo: "Analista de Custos",
    status: "ativo",
    empresa: "EcoRioMinas",
    contrato: "ECORIOMINAS",
    email: "juliana.martins@ecoriominas.com.br",
    telefone: "(11) 92109-8765",
    areas: ["edificacao", "saneamento"],
    disciplina: "PROJETO",
    competencias: ["Orçamentação", "Análise de Custos", "Planejamento Financeiro"],
    dataAdmissao: "2021-09-05"
  },
  {
    id: 9,
    nome: "Lucas Almeida",
    cpf: "369.147.258-00",
    cargo: "Topógrafo",
    status: "inativo",
    empresa: "EIXO Engenharia",
    contrato: "EIXO 1",
    email: "lucas.almeida@eixo.com.br",
    telefone: "(11) 91098-7654",
    areas: ["rodovia", "ferrovia", "saneamento"],
    disciplina: "OBRA",
    competencias: ["Levantamento Topográfico", "Geoprocessamento"],
    dataAdmissao: "2019-04-12"
  },
  {
    id: 10,
    nome: "Camila Rodrigues",
    cpf: "741.852.963-00",
    cargo: "Engenheira de Tráfego",
    status: "ativo",
    empresa: "Entrevias",
    contrato: "CONTRATO GLOBAL",
    email: "camila.rodrigues@entrevias.com.br",
    telefone: "(11) 90987-6543",
    areas: ["rodovia"],
    disciplina: "PROJETO",
    competencias: ["Engenharia de Tráfego", "Sinalização", "Mobilidade Urbana"],
    dataAdmissao: "2020-06-18"
  },
  {
    id: 11,
    nome: "Ricardo Nascimento",
    cpf: "852.963.741-00",
    cargo: "Coordenador de Obras",
    status: "banco_de_dados",
    empresa: "Ecopistas",
    contrato: "ECOPISTAS",
    email: "ricardo.nascimento@ecopistas.com.br",
    telefone: "(11) 89876-5432",
    areas: ["ferrovia", "rodovia"],
    disciplina: "OBRA",
    competencias: ["Coordenação de Obras", "Gestão de Contratos"],
    dataAdmissao: "2016-12-01"
  },
  {
    id: 12,
    nome: "Patrícia Mendes",
    cpf: "963.741.852-00",
    cargo: "Especialista em BIM",
    status: "ativo",
    empresa: "EcoRioMinas",
    contrato: "ECORIOMINAS",
    email: "patricia.mendes@ecoriominas.com.br",
    telefone: "(11) 88765-4321",
    areas: ["edificacao", "iluminacao_publica"],
    disciplina: "PROJETO",
    competencias: ["Modelagem BIM", "Revit", "Navisworks"],
    dataAdmissao: "2022-08-25"
  }
];

export const empresas = [
  "EIXO Engenharia",
  "Entrevias",
  "Ecopistas",
  "EcoRioMinas"
];

export const contratos: Array<'EIXO 1' | 'ENTREVIAS' | 'ECOPISTAS' | 'ECORIOMINAS' | 'CONTRATO GLOBAL'> = [
  "EIXO 1",
  "ENTREVIAS",
  "ECOPISTAS",
  "ECORIOMINAS",
  "CONTRATO GLOBAL"
];

export const areasAtuacao = [
  { value: "rodovia", label: "Rodovia" },
  { value: "ferrovia", label: "Ferrovia" },
  { value: "saneamento", label: "Saneamento" },
  { value: "iluminacao_publica", label: "Iluminação Pública" },
  { value: "edificacao", label: "Edificação/Habitação" }
];
