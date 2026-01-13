"use client"

import { useState, useMemo } from 'react';
import { usePeople } from '@/contexts/PeopleContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Loader2, PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import { FilterPanel } from '@/components/FilterPanel';
import { FilterState } from '@/types/person';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const STATUS_COLORS: Record<string, string> = {
    'ativo': '#10b981',
    'inativo': '#ef4444',
    'ferias': '#f59e0b',
    'afastado': '#64748b'
};

const VIGENCIA_COLORS: Record<string, string> = {
    'vigente': '#10b981', // green
    'vencido': '#ef4444', // red
    'a vencer': '#f59e0b', // orange
    'indefinido': '#94a3b8' // grey
};

const initialFilters: FilterState = {
  search: '',
  status: 'all',
  empresa: '',
  areas: [],
  contrato: 'all',
  disciplina: 'all',
};

export default function GraficosPage() {
  const { people, loading } = usePeople();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Compute unique options
  const uniqueCompanies = useMemo(() => {
    const companies = new Set(people.map(p => p.empresa).filter(Boolean));
    return Array.from(companies).sort();
  }, [people]);

  const uniqueContracts = useMemo(() => {
    const contracts = new Set<string>();
    people.forEach(p => {
      if (p.contrato) contracts.add(p.contrato);
      p.contratosDetalhados?.forEach(c => contracts.add(c.nome));
    });
    return Array.from(contracts).filter(c => c && c !== 'Sem Contrato').sort();
  }, [people]);

  // Filter Logic
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const searchLower = filters.search.toLowerCase();
      if (filters.search && !person.nome.toLowerCase().includes(searchLower) && 
          !person.cpf.includes(filters.search) && 
          !person.email.toLowerCase().includes(searchLower)) {
          return false;
      }
      
      if (filters.status !== 'all' && person.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.empresa && person.empresa?.toLowerCase() !== filters.empresa.toLowerCase()) return false;
      if (filters.areas.length > 0) {
          const personAreas = person.areas || [];
          const hasMatchingArea = filters.areas.some(filterArea => 
            personAreas.some(personArea => personArea.toLowerCase() === filterArea.toLowerCase())
          );
          if (!hasMatchingArea) return false;
      }
      if (filters.contrato !== 'all') {
           const fContrato = filters.contrato.toLowerCase();
           const pContrato = person.contrato?.toLowerCase();
           const pDetalhados = person.contratosDetalhados?.map(c => c.nome.toLowerCase()) || [];
           if (pContrato !== fContrato && !pDetalhados.includes(fContrato)) return false;
      }
      if (filters.disciplina !== 'all') {
          if (filters.disciplina === 'PROJETO' && !person.atuacaoProjeto) return false;
          if (filters.disciplina === 'OBRA' && !person.atuacaoObra) return false;
      }
      return true;
    });
  }, [people, filters]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <p className="text-muted-foreground">Carregando indicadores...</p>
        </div>
    );
  }

  // Process Data using FILTERED people
  const dataset = filteredPeople;
  
  // 1. Status Distribution
  const statusCounts = dataset.reduce((acc, p) => {
      const s = (p.status || 'ativo').toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value,
      color: STATUS_COLORS[name] || '#8884d8'
  }));

  // 2. Vigencia Status Data
  const vigenciaCounts = dataset.reduce((acc, p) => {
      let s = (p.vigenciaStatus || 'Indefinido').toLowerCase();
      if (s.includes('vencid')) s = 'vencido';
      if (s.includes('vigen')) s = 'vigente';
      
      acc[s] = (acc[s] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  
  const vigenciaData = Object.entries(vigenciaCounts).map(([name, value]) => ({
       name: name.charAt(0).toUpperCase() + name.slice(1),
       value,
       color: VIGENCIA_COLORS[name] || '#94a3b8'
  }));

  // 3. Contracts Distribution
  const contractCounts = dataset.reduce((acc, p) => {
      if (p.contratosDetalhados && p.contratosDetalhados.length > 0) {
          p.contratosDetalhados.forEach(d => {
              const tipo = d.tipo || 'Outros';
              acc[tipo] = (acc[tipo] || 0) + 1;
          });
      }
      // If needed, we can count global too, but mixing types is confusing.
      // We focus on "Allocations".
      return acc;
  }, {} as Record<string, number>);

  const contractData = Object.entries(contractCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);

  // 4. Top Cargos
  const cargoCounts = dataset.reduce((acc, p) => {
      let c = p.cargo?.trim() || 'Não Informado';
      acc[c] = (acc[c] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  
  const cargoData = Object.entries(cargoCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 10);

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PieIcon className="h-8 w-8 text-primary" />
            Painel de Indicadores
        </h1>
        <p className="text-muted-foreground text-lg">
            Análise visual da distribuição da equipe, contratos e vigências.
        </p>
      </div>

      <FilterPanel 
         filters={filters}
         onFilterChange={setFilters}
         onClearFilters={() => setFilters(initialFilters)}
         resultCount={dataset.length}
         totalCount={people.length}
         companies={uniqueCompanies}
         contracts={uniqueContracts}
      />

      {dataset.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 dashed border-muted">
              <p className="text-muted-foreground">Nenhum dado encontrado com os filtros atuais.</p>
              <button onClick={() => setFilters(initialFilters)} className="text-primary hover:underline mt-2">Limpar Filtros</button>
          </div>
      ) : (
          <div className="grid gap-6 md:grid-cols-2">
             {/* Status Chart */}
             <Card className="shadow-lg border-t-4 border-t-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieIcon className="h-5 w-5 opacity-70" /> Status dos Colaboradores</CardTitle>
                    <CardDescription>Distribuição Ativo / Inativo / Férias</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={statusData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5}
                                dataKey="value" 
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             {/* Vigencia Chart */}
             <Card className="shadow-lg border-t-4 border-t-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 opacity-70" /> Status de Vigência</CardTitle>
                    <CardDescription>Monitoramento de contratos a vencer e vencidos</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={vigenciaData} 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={80} 
                                dataKey="value" 
                                label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                 {vigenciaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             {/* Contracts Bar Chart */}
             <Card className="col-span-full md:col-span-1 shadow-lg border-t-4 border-t-blue-500/20">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 opacity-70" /> Distribuição por Contrato</CardTitle>
                    <CardDescription>Quantidade de colaboradores por contrato (Eixo 1, Entrevias, etc)</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contractData} layout="vertical" margin={{ left: 0, right: 30, top: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#94a3b8' }} />
                        </BarChart>
                    </ResponsiveContainer>
                 </CardContent>
             </Card>

             {/* Cargos Bar Chart */}
             <Card className="col-span-full md:col-span-1 shadow-lg border-t-4 border-t-violet-500/20">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 opacity-70" /> Top 10 Cargos</CardTitle>
                    <CardDescription>Cargos com maior número de ocupantes</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cargoData} layout="vertical" margin={{ left: 0, right: 30, top: 20 }}>
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 11, fill: '#94a3b8'}} interval={0} />
                             <Tooltip 
                                 cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                             />
                             <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={18} label={{ position: 'right', fill: '#94a3b8' }} />
                        </BarChart>
                    </ResponsiveContainer>
                 </CardContent>
             </Card>
          </div>
      )}
    </div>
  );
}
