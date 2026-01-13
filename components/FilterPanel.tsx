import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterState, PersonStatus, AreaAtuacao, Contrato, Disciplina } from '@/types/person';
import { empresas, contratos, areasAtuacao } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount,
}: FilterPanelProps) {
  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.empresa ||
    filters.areas.length > 0 ||
    filters.contrato !== 'all' ||
    filters.disciplina !== 'all';

  const toggleArea = (area: AreaAtuacao) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter((a) => a !== area)
      : [...filters.areas, area];
    onFilterChange({ ...filters, areas: newAreas });
  };

  return (
    <div className="space-y-4 rounded-xl border p-4 shadow-card" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF ou e-mail..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10 h-11"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFilterChange({ ...filters, status: value as PersonStatus | 'all' })
          }
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="banco de dados">Banco de Dados</SelectItem>
            <SelectItem value="baixa frequencia">Baixa Frequência</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.empresa || 'all'}
          onValueChange={(value) =>
            onFilterChange({ ...filters, empresa: value === 'all' ? '' : value })
          }
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Empresas</SelectItem>
            {empresas.map((empresa) => (
              <SelectItem key={empresa} value={empresa}>
                {empresa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.contrato}
          onValueChange={(value) =>
            onFilterChange({ ...filters, contrato: value as Contrato | 'all' })
          }
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Contrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Contratos</SelectItem>
            {contratos.map((contrato) => (
              <SelectItem key={contrato} value={contrato}>
                {contrato}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.disciplina}
          onValueChange={(value) =>
            onFilterChange({ ...filters, disciplina: value as Disciplina | 'all' })
          }
        >
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue placeholder="Disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="PROJETO">Projeto</SelectItem>
            <SelectItem value="OBRA">Obra</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-10 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Areas de Atuação */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          Áreas:
        </span>
        {areasAtuacao.map((area) => (
          <Badge
            key={area.value}
            variant={filters.areas.includes(area.value as AreaAtuacao) ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all hover:scale-105',
              filters.areas.includes(area.value as AreaAtuacao)
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary'
            )}
            onClick={() => toggleArea(area.value as AreaAtuacao)}
          >
            {area.label}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-t pt-3">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{resultCount}</span> de{' '}
          <span className="font-semibold text-foreground">{totalCount}</span> pessoas
        </p>
      </div>
    </div>
  );
}
