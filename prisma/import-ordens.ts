
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), 'prisma', 'data', 'ordens.txt');
  console.log(`Reading file: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');

  console.log(`Found ${lines.length} lines to process.`);

  for (const line of lines) {
    const cols = line.split('\t');
    if (cols.length < 6) {
      console.warn(`Skipping invalid line (cols=${cols.length}): ${line}`);
      continue;
    }

    const contrato = cols[0]?.trim();
    const dataContrato = cols[1]?.trim();
    const ordemServico = cols[2]?.trim();
    const dataOrdemServico = cols[3]?.trim();
    const nome = cols[4]?.trim();
    const cliente = cols[5]?.trim();
    const valorRaw = cols[6]?.trim() || '0';

    // Parse Value
    // Remove "R$ ", remove ".", replace "," with "."
    let valorNegociado = 0;
    if (valorRaw !== '-' && valorRaw !== '') {
       const cleanVal = valorRaw.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
       valorNegociado = parseFloat(cleanVal);
       if (isNaN(valorNegociado)) valorNegociado = 0;
    }

    // Check duplicates?
    // We assume unique combination of contrato + ordemServico + nome?
    const existing = await prisma.ordemServico.findFirst({
        where: {
            contrato,
            ordemServico,
            nome
        }
    });

    if (existing) {
        console.log(`Updating existing OS: ${ordemServico} for ${nome}`);
        await prisma.ordemServico.update({
            where: { id: existing.id },
            data: {
                dataContrato,
                dataOrdemServico,
                cliente,
                valorNegociado,
                updatedAt: new Date()
            }
        });
    } else {
        console.log(`Creating new OS: ${ordemServico} for ${nome}`);
        await prisma.ordemServico.create({
            data: {
                contrato,
                dataContrato,
                ordemServico,
                dataOrdemServico,
                nome,
                cliente,
                valorNegociado,
                status: 'ativo'
            }
        });
    }
  }

  console.log('Finished import.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
