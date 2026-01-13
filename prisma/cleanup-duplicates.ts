
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Analyzing duplicates...');
  
  const people = await prisma.person.findMany({
    select: { id: true, nome: true, cpf: true, updatedAt: true }
  });

  const byName = new Map<string, typeof people>();
  
  for (const p of people) {
    if (!p.nome) continue;
    const n = p.nome.trim().toUpperCase();
    if (!byName.has(n)) byName.set(n, []);
    byName.get(n)!.push(p);
  }

  let deletedCount = 0;
  
  for (const [name, list] of byName.entries()) {
    if (list.length > 1) {
      console.log(`Found ${list.length} records for "${name}"`);
      
      // Sort logic:
      // 1. Real CPF first (not containing MISSING)
      // 2. Newest updatedAt first
      list.sort((a, b) => {
         const aIsReal = !a.cpf.includes('MISSING');
         const bIsReal = !b.cpf.includes('MISSING');
         
         if (aIsReal && !bIsReal) return -1;
         if (!aIsReal && bIsReal) return 1;
         
         return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      
      const toKeep = list[0];
      const toDelete = list.slice(1);
      
      console.log(`  ✅ Keeping: ${toKeep.id} (CPF: ${toKeep.cpf})`);
      
      for (const d of toDelete) {
          console.log(`  ❌ Deleting: ${d.id} (CPF: ${d.cpf})`);
          try {
            await prisma.person.delete({ where: { id: d.id } });
            deletedCount++;
          } catch (e) {
              console.error(`Error deleting ${d.id}:`, e);
          }
      }
    }
  }
  
  console.log(`\n🎉 Cleanup finished! Removed ${deletedCount} duplicate records.`);
}

main()
  .catch((e) => {
      console.error(e);
      process.exit(1);
  })
  .finally(async () => {
      await prisma.$disconnect();
  });
