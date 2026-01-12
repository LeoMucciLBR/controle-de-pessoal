"use client"

import { useState, useMemo } from 'react';
import { Plus, Download, LayoutGrid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterPanel } from '@/components/FilterPanel';
import { PersonTable } from '@/components/PersonTable';
import { PersonCardGrid } from '@/components/PersonCardGrid';
import { Pagination } from '@/components/Pagination';
import { PersonDetailModal } from '@/components/PersonDetailModal';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { usePeople } from '@/contexts/PeopleContext';
import { FilterState, Person } from '@/types/person';
import { PersonFormModal } from '@/components/PersonFormModalNew';
import { toast } from 'sonner';

const initialFilters: FilterState = {
  search: '',
  status: 'all',
  empresa: '',
  areas: [],
  contrato: 'all',
  disciplina: 'all',
};

type ViewMode = 'table' | 'grid';

export default function DashboardClient() {
  const { people, loading, addPerson, updatePerson, deletePerson } = usePeople();
  
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewPerson, setViewPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Person | number[] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [saving, setSaving] = useState(false);

  // Filter logic
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
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
        const personAreas = person.areas || [];
        const hasMatchingArea = filters.areas.some((area) => personAreas.includes(area));
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
  }, [filters, people]);

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

  const handleAdd = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleSavePerson = async (personData: Person) => {
    try {
      setSaving(true);
      if (editingPerson) {
        await updatePerson(editingPerson.id, personData);
        toast.success('Pessoa atualizada com sucesso!');
      } else {
        await addPerson(personData);
        toast.success('Pessoa cadastrada com sucesso!');
      }
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar pessoa');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (person: Person) => {
    setDeleteTarget(person);
  };

  const handleDuplicate = async (person: Person) => {
    try {
      const { id, ...personData } = person;
      await addPerson({ ...personData, nome: `${person.nome} (Cópia)` });
      toast.success(`Pessoa duplicada: ${person.nome}`, {
        description: 'Uma cópia foi criada com sucesso.',
      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao duplicar pessoa');
    }
  };

  const handleDeleteSelected = () => {
    setDeleteTarget(selectedIds);
  };

  const handleConfirmDelete = async () => {
    try {
      if (Array.isArray(deleteTarget)) {
        for (const id of deleteTarget) {
          await deletePerson(id);
        }
        toast.success(`${deleteTarget.length} pessoa(s) excluída(s)`, {
          description: 'Os registros foram removidos com sucesso.',
        });
        setSelectedIds([]);
      } else if (deleteTarget) {
        await deletePerson(deleteTarget.id);
        toast.success('Registro excluído', {
          description: 'O registro foi removido com sucesso.',
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando pessoas...</p>
        </div>
      </div>
    );
  }

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
             <div className="flex bg-muted/50 p-1 rounded-md border border-border mr-2">
                <Button 
                   variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className="h-8 w-8" 
                   onClick={() => setViewMode('table')}
                   title="Visualização em Lista"
                >
                   <List className="h-4 w-4" />
                </Button>
                <Button 
                   variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className="h-8 w-8" 
                   onClick={() => setViewMode('grid')}
                   title="Visualização em Cards"
                >
                   <LayoutGrid className="h-4 w-4" />
                </Button>
             </div>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleAdd}>
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
          totalCount={people.length}
        />

        {/* Content View */}
        {viewMode === 'table' ? (
           <PersonTable
             people={paginatedPeople}
             selectedIds={selectedIds}
             onSelectionChange={setSelectedIds}
             onView={handleView}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onDuplicate={handleDuplicate}
           />
        ) : (
           <PersonCardGrid 
             people={paginatedPeople}
             selectedIds={selectedIds}
             onSelectionChange={setSelectedIds}
             onView={handleView}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onDuplicate={handleDuplicate}
           />
        )}

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

        {/* Form Modal */}
        <PersonFormModal
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            person={editingPerson}
            onSave={handleSavePerson}
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
