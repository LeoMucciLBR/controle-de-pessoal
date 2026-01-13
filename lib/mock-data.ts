import { Person, PersonStatus, AreaAtuacao } from "@/types/person";

export const empresas = [
    "TechCorp Solutions",
    "Engenharia Avançada Ltda",
    "Constructo Brasil",
    "Inova Projetos",
    "Infraestrutura Global",
    "Ambiente Seguro Consultoria"
];

export const contratos = [
    "EIXO 1",
    "ENTREVIAS",
    "ECOPISTAS",
    "ECORIOMINAS",
    "CONTRATO GLOBAL"
];

export const areasAtuacao = [
    { label: "Rodovia", value: "rodovia" },
    { label: "Ferrovia", value: "ferrovia" },
    { label: "Drenagem", value: "drenagem" },
    { label: "Obras de Arte", value: "oae" },
    { label: "Meio Ambiente", value: "meio_ambiente" },
    { label: "Edificações", value: "edificacao" }
];

export const disciplinasProjetoList = [
    "AR CONDICIONADO", "ARQUITETURA", "AUTOMAÇÃO", "BIM", "CONTENÇÃO", "CRONOGRAMA", 
    "DESAPROPRIAÇÃO", "DRENAGEM", "ELÉTRICA", "ESTRUTURAL", "GEOTECNIA", "GEOMETRIA", 
    "HIDRAÚLICA", "INCÊNDIO", "MEIO AMBIENTE", "MECÂNICA", "ORÇAMENTO", "PAISAGISMO", 
    "PAVIMENTAÇÃO", "TOPOGRAFIA", "SINALIZAÇÃO"
];

export const disciplinasObraList = [
    "PLANEJAMENTO", "AUTOMAÇÃO", "FISCALIZAÇÃO DE OBRA", "DOCUMENTAÇÃO", 
    "OBRA DE SANEAMENTO", "ORÇAMENTO", "BARRAGEM", "SAÚDE E SEGURANÇA", 
    "OAE", "ELÉTRICA", "LABORATORISTA"
];

export const mockPeople: Person[] = [
    {
        id: 1,
        nome: "Ana Silva",
        email: "ana.silva@techcorp.com",
        cargo: "Engenheira Civil Senior",
        empresa: "TechCorp Solutions",
        status: "ativo",
        contrato: "CONTRATO GLOBAL",
        contratosAtivos: ["CONTRATO GLOBAL"],
        disciplina: "PROJETO",
        areas: ["rodovia"],
        competencias: ["AutoCAD", "Civil 3D", "Gestão de Equipes"],
        disciplinasProjeto: ["GEOMETRIA", "PAVIMENTAÇÃO"],
        disciplinasObra: [],
        treinamentos: ["NR-10", "Direção Defensiva"],
        historicoProfissional: "10 anos de experiência em projetos rodoviários de grande porte.",
        termoConfidencialidade: true,
        apresentouCartaoCnpj: false,
        certidaoQuitacaoPf: true,
        certidaoQuitacaoPj: false,
        curriculo: true,
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123, São Paulo - SP",
        rg: "123456789",
        dataNascimento: "1985-05-20",
        cpf: "123.456.789-00"
    },
    {
        id: 2,
        nome: "Carlos Souza",
        email: "carlos.souza@constructo.com",
        cargo: "Técnico em Edificações",
        empresa: "Constructo Brasil",
        status: "ativo",
        contrato: "CONTRATO GLOBAL",
        contratosAtivos: ["CONTRATO GLOBAL"],
        disciplina: "OBRA",
        areas: ["edificacao"],
        competencias: ["Fiscalização", "Relatórios Técnicos"],
        disciplinasProjeto: [],
        disciplinasObra: ["FISCALIZAÇÃO DE OBRA", "DOCUMENTAÇÃO"],
        treinamentos: ["NR-35"],
        historicoProfissional: "Especialista em fiscalização de obras civis e industriais.",
        termoConfidencialidade: true,
        apresentouCartaoCnpj: true,
        certidaoQuitacaoPf: true,
        certidaoQuitacaoPj: true,
        curriculo: true,
         telefone: "(21) 91234-5678",
        endereco: "Av. Atlântica, 500, Rio de Janeiro - RJ",
        rg: "987654321",
        dataNascimento: "1990-11-15",
        cpf: "987.654.321-00"
    },
    {
        id: 3,
        nome: "Mariana Costa",
        email: "mariana.costa@inova.com",
        cargo: "Arquiteta Urbanista",
        empresa: "Inova Projetos",
        status: "banco_de_dados",
        contrato: "CONTRATO GLOBAL",
        contratosAtivos: [],
        disciplina: "PROJETO",
        areas: ["edificacao"],
        competencias: ["Revit", "SketchUp", "Lumion"],
        disciplinasProjeto: ["ARQUITETURA", "PAISAGISMO"],
        disciplinasObra: [],
        treinamentos: [],
        historicoProfissional: "Focada em projetos sustentáveis e urbanismo.",
        termoConfidencialidade: false,
        apresentouCartaoCnpj: false,
        certidaoQuitacaoPf: false,
        certidaoQuitacaoPj: false,
        curriculo: true,
        telefone: "(31) 99876-5432",
        endereco: "Rua da Serra, 88, Belo Horizonte - MG",
        rg: "456789123",
         dataNascimento: "1992-08-30",
         cpf: "456.789.123-00"
    }
];
