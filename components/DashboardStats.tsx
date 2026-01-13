import { useMemo } from 'react';
import { Person } from '@/types/person';
import { Users, Building2, AlertTriangle, CheckCircle2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  people: Person[];
  onStatClick: (type: 'active' | 'contract' | 'expired' | 'expiring', value?: string) => void;
}

export function DashboardStats({ people, onStatClick }: DashboardStatsProps) {
  const stats = useMemo(() => {
    // ... same logic ...
    const total = people.length;
    const active = people.filter(p => p.status?.toLowerCase() === 'ativo').length;
    
    // Contracts logic
    const contractsMap = new Map<string, number>();
    people.forEach(p => {
        if (p.contrato && (p.contrato as string) !== 'Sem Contrato') {
             contractsMap.set(p.contrato, (contractsMap.get(p.contrato) || 0) + 1);
        }
        p.contratosDetalhados?.forEach(c => {
            contractsMap.set(c.nome, (contractsMap.get(c.nome) || 0) + 1);
        });
    });
    let topContract = { name: 'Nenhum', count: 0 };
    contractsMap.forEach((count, name) => {
        if (count > topContract.count) topContract = { name, count };
    });

    // Vigencia logic
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    let expired = 0;
    let expiringSoon = 0;

    people.forEach(p => {
        if (p.vigenciaStatus?.toLowerCase() === 'vencido') {
            expired++;
            return;
        }
        if (p.vigenciaFim) {
             const d = new Date(p.vigenciaFim);
             if (!isNaN(d.getTime())) {
                 if (d < now && p.vigenciaStatus?.toLowerCase() !== 'vigente') {
                     expired++;
                 } else if (d <= thirtyDaysFromNow && d >= now) {
                     expiringSoon++;
                 }
             }
        }
    });

    return {
      total,
      active,
      inactive: total - active,
      topContract,
      expired,
      expiringSoon
    };
  }, [people]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {/* Active People */}
      <motion.div variants={item} onClick={() => onStatClick('active')} className="cursor-pointer">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4" />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Colaboradores Ativos</p>
                        <h3 className="text-2xl font-bold mt-2 text-foreground">{stats.active}</h3>
                        <p className="text-xs text-blue-500 mt-1 font-medium">
                            de {stats.total} total
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      {/* Contracts */}
      <motion.div variants={item} onClick={() => onStatClick('contract', stats.topContract.name)} className="cursor-pointer">
        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4" />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">Maior Contrato</p>
                        <h3 className="text-xl font-bold mt-2 text-foreground truncate" title={stats.topContract.name}>
                            {stats.topContract.name}
                        </h3>
                        <p className="text-xs text-purple-500 mt-1 font-medium">
                            {stats.topContract.count} pessoas vinculadas
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      {/* Expired Vigencia */}
      <motion.div variants={item} onClick={() => onStatClick('expired')} className="cursor-pointer">
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/5 to-transparent hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4" />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Vigências Vencidas</p>
                        <h3 className="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">{stats.expired}</h3>
                        <p className="text-xs text-red-500 mt-1 font-medium">
                            Requer atenção imediata
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

      {/* Expiring Soon */}
      <motion.div variants={item} onClick={() => onStatClick('expiring')} className="cursor-pointer">
        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4" />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Vencem em 30 dias</p>
                        <h3 className="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">{stats.expiringSoon}</h3>
                        <p className="text-xs text-amber-500 mt-1 font-medium">
                            Planejar renovação
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
}
