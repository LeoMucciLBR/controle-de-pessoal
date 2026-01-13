
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
// @ts-ignore
const readFile = XLSX.readFile || XLSX.default?.readFile;
// @ts-ignore
const utils = XLSX.utils || XLSX.default?.utils;
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

const FILE_PATH = path.join(process.cwd(), 'FSG 6.1 E - CONTROLE DE PESSOAL X COMPETÊNCIA - REV. 06.xlsm');

// Helper to parse Excel Dates to String (YYYY-MM-DD)
function parseExcelDateToString(value: any): string | null {
  if (!value) return null;
  let date: Date | null = null;
  
  if (value instanceof Date) date = value;
  else if (typeof value === 'number') {
    date = new Date((value - 25569) * 86400 * 1000);
  }
  else if (typeof value === 'string') {
    const parts = value.split('/');
    if (parts.length === 3) {
       date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
       date = new Date(value);
    }
  }
  
  if (date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
  }
  return null;
}

// Helper for strings
function getVal(row: any[], idx: number): string {
    const v = row[idx];
    return v ? String(v).trim() : '';
}

// Helper for Booleans (SIM/OK/X)
function getBool(row: any[], idx: number): boolean {
    const v = row[idx];
    if (!v) return false;
    const s = String(v).toUpperCase().trim();
    // Allow any non-empty string that isn't negative
    return s !== '' && s !== '-' && s !== 'NÃO' && s !== 'NAO' && s !== 'FALSE' && s !== '0';
}

async function main() {
  console.log('🚀 Iniciando importação do Excel...');
  
  if (!fs.existsSync(FILE_PATH)) {
      console.error('Arquivo não encontrado:', FILE_PATH);
      process.exit(1);
  }

  const workbook = readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // Start from row 2 (index 2 in 0-based array of rows, assuming header is row 1)
  const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });

  // Indexes based on headers.txt mapping
  const IDX = {
      STATUS: 0,
      NOME: 1,
      CARGO: 2,
      FORMACAO: 3,
      RODOVIA: 4,
      FERROVIA: 5,
      SANEAMENTO: 6,
      ILUMINACAO: 7,
      EDIFICACAO: 8,
      NASCIMENTO: 9,
      RG: 10,
      CPF: 11,
      TELEFONE: 12,
      EMAIL: 13,
      ENDERECO: 14,
      EMPRESA: 15,
      APRESENTOU_CNPJ: 16,
      NUM_CNPJ: 17,
      CONSELHO: 18,
      NUM_REGISTRO: 20,
      CERTIDAO_PF: 21,
      CERTIDAO_PJ: 22,
      CERTIDAO_STATUS: 23,
      CURRICULO: 24,
      HISTORICO: 25,
      TERMO_CONFID: 26,
      TREINAMENTOS: 27,
      // Contracts
      EIXO_1: 28,
      ENTREVIAS: 29,
      ECOPISTAS: 30,
      ECORIOMINAS: 31,
      CONTRATO_GLOBAL: 32,
      ADMISSAO: 33,
      VIGENCIA_FIM: 34,
      VIGENCIA_STATUS: 35,
      
      // Disciplinas Projeto (Starts 37)
      DISC_PROJ_START: 37,
      DISC_PROJ_END: 70,
      
      // Disciplinas Obra
      DISC_OBRA_START: 72,
      DISC_OBRA_END: 82
  };

  const dataRows = rows.slice(2);
  let count = 0;
  let skipped = 0;

  for (const row of dataRows) {
      if (!row || row.length === 0) continue;
      const nome = getVal(row, IDX.NOME);
      if (!nome) {
          skipped++;
          continue;
      }

      console.log(`Processando: ${nome}`);

      // Parse Arrays
      const areas: string[] = [];
      if (getBool(row, IDX.RODOVIA)) areas.push('RODOVIA');
      if (getBool(row, IDX.FERROVIA)) areas.push('FERROVIA');
      if (getBool(row, IDX.SANEAMENTO)) areas.push('SANEAMENTO');
      if (getBool(row, IDX.ILUMINACAO)) areas.push('ILUMINAÇÃO');
      if (getBool(row, IDX.EDIFICACAO)) areas.push('EDIFICAÇÃO');

      // Contracts Detalhados
      const contratoDetalheRaw = getVal(row, IDX.CONTRATO_GLOBAL) || getVal(row, 29) || '';
      
      // Parse "Name Date" (e.g. "CT. 00012/24 10/04/2024")
      let contratoNome = contratoDetalheRaw;
      let contratoData = new Date().toLocaleDateString('pt-BR'); // Default
      
      // Regex for DD/MM/YYYY
      const dateMatch = contratoDetalheRaw.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch) {
          contratoData = dateMatch[0];
          contratoNome = contratoDetalheRaw.replace(dateMatch[0], '').trim();
      } else {
        if (!contratoDetalheRaw) contratoNome = 'Código não informado';
      }

      const contratosDetalhados: any[] = [];
      if (getBool(row, IDX.EIXO_1)) contratosDetalhados.push({ tipo: 'EIXO 1', nome: contratoNome, data: contratoData });
      if (getBool(row, IDX.ENTREVIAS)) contratosDetalhados.push({ tipo: 'ENTREVIAS', nome: contratoNome, data: contratoData });
      if (getBool(row, IDX.ECOPISTAS)) contratosDetalhados.push({ tipo: 'ECOPISTAS', nome: contratoNome, data: contratoData });
      if (getBool(row, IDX.ECORIOMINAS)) contratosDetalhados.push({ tipo: 'ECORIOMINAS', nome: contratoNome, data: contratoData });

      // Disciplinas
      const discProjeto: string[] = [];
      for (let i = IDX.DISC_PROJ_START; i <= IDX.DISC_PROJ_END; i++) {
         if (getBool(row, i)) {
             const header = rows[1][i];
             if (header) discProjeto.push(String(header).trim());
         }
      }

      const discObra: string[] = [];
      for (let i = IDX.DISC_OBRA_START; i <= IDX.DISC_OBRA_END; i++) {
         if (getBool(row, i)) {
             const header = rows[1][i];
             if (header) discObra.push(String(header).trim());
         }
      }

      const activityTypes: string[] = [];
      if (discProjeto.length > 0) activityTypes.push('PROJETO');
      if (discObra.length > 0) activityTypes.push('OBRA');
      if (activityTypes.length === 0) activityTypes.push('PROJETO');

      const areasDetalhes: Record<string, string[]> = {};
      areas.forEach(a => {
          areasDetalhes[a] = activityTypes;
      });

      // Data Cleaning
      let cpf = getVal(row, IDX.CPF).replace(/\D/g, '');
      if (!cpf || cpf.length < 5) { // Too small CPF?
          cpf = `MISSING-${Date.now()}-${count}`;
      }

      const email = getVal(row, IDX.EMAIL) || `sem_email_${Date.now()}_${count}@lb.com`;
      const cargo = getVal(row, IDX.CARGO) || 'Não Informado';
      const empresa = getVal(row, IDX.EMPRESA) || 'Não Informada';
      const telefone = getVal(row, IDX.TELEFONE) || '-';

      // Vigencia Parsing
      const vigenciaFimRaw = row[IDX.VIGENCIA_FIM];
      let vigenciaFim = parseExcelDateToString(vigenciaFimRaw);
      if (!vigenciaFim && typeof vigenciaFimRaw === 'string' && vigenciaFimRaw.length > 0) {
          vigenciaFim = vigenciaFimRaw; // Keep "N/A" or "Indeterminado"
      }
      
      const dataAdmissao = parseExcelDateToString(row[IDX.ADMISSAO]);

      const personData = {
          nome: nome,
          cargo: cargo,
          cpf: cpf,
          rg: getVal(row, IDX.RG) || null,
          email: email,
          telefone: telefone,
          
          dataAdmissao: dataAdmissao,
          dataNascimento: parseExcelDateToString(row[IDX.NASCIMENTO]),
          endereco: getVal(row, IDX.ENDERECO) || null,
          empresa: empresa,
          contrato: getVal(row, IDX.CONTRATO_GLOBAL) || 'Sem Contrato',
          
          vigenciaInicio: dataAdmissao, // Copy Admissao to Vigencia Inicio
          vigenciaFim: vigenciaFim,
          vigenciaStatus: getVal(row, IDX.VIGENCIA_STATUS) || null,
          
          termoConfidencialidade: getBool(row, IDX.TERMO_CONFID),
          curriculo: getBool(row, IDX.CURRICULO),
          apresentouCartaoCnpj: getBool(row, IDX.APRESENTOU_CNPJ),
          numeroCnpj: getVal(row, IDX.NUM_CNPJ) || null,
          conselhoClasse: getVal(row, IDX.CONSELHO) || null,
          numeroRegistroConselho: getVal(row, IDX.NUM_REGISTRO) || null,
          
          certidaoQuitacaoPf: getBool(row, IDX.CERTIDAO_PF),
          certidaoQuitacaoPj: getBool(row, IDX.CERTIDAO_PJ),
          certidaoQuitacaoStatus: getVal(row, IDX.CERTIDAO_STATUS)?.toLowerCase() || null,
          
          historicoProfissional: getVal(row, IDX.HISTORICO) || null,
          treinamentos: getVal(row, IDX.TREINAMENTOS) ? [getVal(row, IDX.TREINAMENTOS)] : [],
          
          areas: areas,
          areasDetalhes: areasDetalhes,
          disciplinasProjeto: discProjeto,
          disciplinasObra: discObra,
          contratosDetalhados: {
              create: contratosDetalhados.map(c => ({
                  tipo: c.tipo,
                  nome: c.nome,
                  data: c.data
              }))
          },
          status: getVal(row, IDX.STATUS) || 'ativo',
          
          atuacaoProjeto: discProjeto.length > 0,
          atuacaoObra: discObra.length > 0,
          disciplina: 'PROJETO'
      };

      try {
          let existing = null;
          // Check CPF length to avoid searching for "MISSING-..."
          if (cpf.length === 11) {
             existing = await prisma.person.findUnique({ where: { cpf } });
          }

          // ...
          
          if (existing) {
              // Force update of Contracts: Delete old, Insert new
              // And ensure areas are updated
              if (areas.length > 0) console.log(`  > Áreas encontradas para ${nome}: ${areas.join(', ')}`);
              
              const { contratosDetalhados: cdCreate, ...rest } = personData;
              
              await prisma.person.update({
                  where: { id: existing.id },
                  data: {
                      ...rest,
                      contratosDetalhados: {
                          deleteMany: {}, // Clear existing
                          create: contratosDetalhados.map(c => ({
                              tipo: c.tipo,
                              nome: c.nome,
                              data: c.data
                          }))
                      }
                  } as any
              });
              console.log(`Updated (Full): ${nome}`);
          } else {
             await prisma.person.create({
                 data: personData
             });
             console.log(`Created: ${nome}`);
          }
          count++;

      } catch (e: any) {
          console.error(`Erro ao importar ${nome}:`, e.message || e);
      }
  }

  console.log(`Importação concluída! Processados: ${count}, Ignorados: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
