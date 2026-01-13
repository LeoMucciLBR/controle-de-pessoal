import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuários
  console.log('👤 Criando usuários...');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lbr.com' },
    update: {},
    create: {
      email: 'admin@lbr.com',
      password: 'admin123', // Em produção, use hash!
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  const systemUser = await prisma.user.upsert({
    where: { email: 'sistema@lbr.com' },
    update: {},
    create: {
      email: 'sistema@lbr.com',
      password: 'sistema123', // Em produção, use hash!
      name: 'Sistema',
      role: 'USER',
    },
  });

  console.log(`  ✅ Admin: ${adminUser.email}`);
  console.log(`  ✅ Sistema: ${systemUser.email}`);

  // Criar configurações (dropdowns)
  console.log('⚙️ Criando configurações...');

  const empresas = [
    'TechCorp Solutions',
    'Engenharia Avançada Ltda',
    'Constructo Brasil',
    'Inova Projetos',
    'Infraestrutura Global',
    'Ambiente Seguro Consultoria',
  ];

  const contratos = [
    "EIXO 1",
    "ENTREVIAS",
    "ECOPISTAS",
    "ECORIOMINAS",
    "CONTRATO GLOBAL"
  ];

  const disciplinasProjeto = [
    'AR CONDICIONADO', 'ARQUITETURA', 'AUTOMAÇÃO', 'BIM', 'CONTENÇÃO', 'CRONOGRAMA',
    'DESAPROPRIAÇÃO', 'DRENAGEM', 'ELÉTRICA', 'ESTRUTURAL', 'GEOTECNIA', 'GEOMETRIA',
    'HIDRAÚLICA', 'INCÊNDIO', 'MEIO AMBIENTE', 'MECÂNICA', 'ORÇAMENTO', 'PAISAGISMO',
    'PAVIMENTAÇÃO', 'TOPOGRAFIA', 'SINALIZAÇÃO',
  ];

  const disciplinasObra = [
    'PLANEJAMENTO', 'AUTOMAÇÃO', 'FISCALIZAÇÃO DE OBRA', 'DOCUMENTAÇÃO',
    'OBRA DE SANEAMENTO', 'ORÇAMENTO', 'BARRAGEM', 'SAÚDE E SEGURANÇA',
    'OAE', 'ELÉTRICA', 'LABORATORISTA',
  ];

  const areas = [
    { value: 'rodovia', label: 'Rodovia' },
    { value: 'ferrovia', label: 'Ferrovia' },
    { value: 'drenagem', label: 'Drenagem' },
    { value: 'oae', label: 'Obras de Arte' },
    { value: 'meio_ambiente', label: 'Meio Ambiente' },
    { value: 'edificacao', label: 'Edificações' },
  ];

  const treinamentos = [
    'NR-10', 'NR-35', 'BIM Management', 'Gestão de Projetos', 'Liderança', 'Scrum Master',
  ];

  // Inserir configurações
  for (const empresa of empresas) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'empresas', value: empresa } },
      update: {},
      create: { category: 'empresas', value: empresa },
    });
  }

  for (const contrato of contratos) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'contratos', value: contrato } },
      update: {},
      create: { category: 'contratos', value: contrato },
    });
  }

  for (const disc of disciplinasProjeto) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'disciplinasProjeto', value: disc } },
      update: {},
      create: { category: 'disciplinasProjeto', value: disc },
    });
  }

  for (const disc of disciplinasObra) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'disciplinasObra', value: disc } },
      update: {},
      create: { category: 'disciplinasObra', value: disc },
    });
  }

  for (const area of areas) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'areas', value: area.value } },
      update: {},
      create: { category: 'areas', value: area.value, label: area.label },
    });
  }

  for (const treinamento of treinamentos) {
    await prisma.setting.upsert({
      where: { category_value: { category: 'treinamentos', value: treinamento } },
      update: {},
      create: { category: 'treinamentos', value: treinamento },
    });
  }

  console.log('  ✅ Configurações criadas!');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
