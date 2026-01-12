"use client"

import { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterPanel } from '@/components/FilterPanel';
import { PersonTable } from '@/components/PersonTable';
import { Pagination } from '@/components/Pagination';
import { PersonDetailModal } from '@/components/PersonDetailModal';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { mockPeople } from '@/lib/mock-data';
import { FilterState, Person } from '@/types/person';
import { toast } from 'sonner';
// import { AppLayout } from '@/components/layout/AppLayout'; // We use our own layout

const initialFilters: FilterState = {
  search: '',
  status: 'all',
  empresa: '',
  areas: [],
  contrato: 'all',
  disciplina: 'all',
};

export default function DashboardClient() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewPerson, setViewPerson] = useState<Person | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Person | number[] | null>(null);

  // Filter logic
  const filteredPeople = useMemo(() => {
    return mockPeople.filter((person) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          person.nome.toLowerCase().includes(searchLower) ||
          person.cpf.includes(filters.search) ||
          person.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && person.status !== filters.status) {
        return false;
      }

      // Empresa filter
      if (filters.empresa && person.empresa !== filters.empresa) {
        return false;
      }

      // Areas filter
      if (filters.areas.length > 0) {
        const hasMatchingArea = filters.areas.some((area) => person.areas.includes(area));
        if (!hasMatchingArea) return false;
      }

      // Contrato filter
      if (filters.contrato !== 'all' && person.contrato !== filters.contrato) {
        return false;
      }

      // Disciplina filter
      if (filters.disciplina !== 'all' && person.disciplina !== filters.disciplina) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredPeople.length / pageSize);
  const paginatedPeople = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPeople.slice(start, start + pageSize);
  }, [filteredPeople, currentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleView = (person: Person) => {
    setViewPerson(person);
  };

  const handleEdit = (person: Person) => {
    toast.info(`Editar: ${person.nome}`, {
      description: 'Funcionalidade de edição em desenvolvimento.',
    });
  };

  const handleDelete = (person: Person) => {
    setDeleteTarget(person);
  };

  const handleDuplicate = (person: Person) => {
    toast.success(`Pessoa duplicada: ${person.nome}`, {
      description: 'Uma cópia foi criada com sucesso.',
    });
  };

  const handleDeleteSelected = () => {
    setDeleteTarget(selectedIds);
  };

  const handleConfirmDelete = () => {
    if (Array.isArray(deleteTarget)) {
      toast.success(`${deleteTarget.length} pessoa(s) excluída(s)`, {
        description: 'Os registros foram removidos com sucesso.',
      });
      setSelectedIds([]);
    } else if (deleteTarget) {
      toast.success('Registro excluído', {
        description: 'O registro foi removido com sucesso.',
      });
    }
    setDeleteTarget(null);
  };

  const handleExportSelected = () => {
    toast.success('Exportação iniciada', {
      description: `${selectedIds.length} registro(s) serão exportados.`,
    });
  };

  const handleExportAll = () => {
    toast.success('Exportação iniciada', {
      description: `${filteredPeople.length} registro(s) serão exportados.`,
    });
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pessoas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os colaboradores e suas competências
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Pessoa
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          resultCount={filteredPeople.length}
          totalCount={mockPeople.length}
        />

        {/* Table */}
        <PersonTable
          people={paginatedPeople}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />

        {/* Pagination */}
        {filteredPeople.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredPeople.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
          onDeleteSelected={handleDeleteSelected}
          onExportSelected={handleExportSelected}
        />

        {/* Detail Modal */}
        <PersonDetailModal
            person={viewPerson}
            open={!!viewPerson}
            onOpenChange={(open) => !open && setViewPerson(null)}
        />

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
        />
      </div>
  );
}
