import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando configurações de contratos antigas...');
  
  // Deletar todos os settings da categoria 'contratos'
  await prisma.setting.deleteMany({
    where: { category: 'contratos' }
  });

  const novosContratos = [
    "EIXO 1",
    "ENTREVIAS",
    "ECOPISTAS",
    "ECORIOMINAS",
    "CONTRATO GLOBAL"
  ];

  console.log('✨ Inserindo novos tipos de contratos...');
  
  for (const contrato of novosContratos) {
    await prisma.setting.create({
      data: { category: 'contratos', value: contrato }
    });
  }

  console.log('✅ Correção concluída com sucesso!');
  console.log('Novos contratos:', novosContratos);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao corrigir contratos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
