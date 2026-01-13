"use client"

import { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Loader2, FileText, Search, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { OrdemServicoFormModal } from '@/components/OrdemServicoFormModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface OrdemServico {
  id: number;
  contrato: string;
  dataContrato: string;
  ordemServico: string;
  dataOrdemServico: string;
  nome: string;
  cliente: string;
  valorNegociado: number;
}

export default function OrdemServicoClient() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrdem, setEditingOrdem] = useState<OrdemServico | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrdemServico | null>(null);

  const fetchOrdens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ordens-servico');
      if (!response.ok) throw new Error('Erro ao buscar ordens');
      const data = await response.json();
      setOrdens(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  const filteredOrdens = useMemo(() => {
    if (!search) return ordens;
    const searchLower = search.toLowerCase();
    return ordens.filter(o => 
      o.contrato.toLowerCase().includes(searchLower) ||
      o.ordemServico.toLowerCase().includes(searchLower) ||
      o.nome.toLowerCase().includes(searchLower) ||
      o.cliente.toLowerCase().includes(searchLower)
    );
  }, [ordens, search]);

  const handleAdd = () => {
    setEditingOrdem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ordem: OrdemServico) => {
    setEditingOrdem(ordem);
    setIsFormOpen(true);
  };

  const handleSave = async (data: Partial<OrdemServico>) => {
    try {
      if (editingOrdem) {
        const response = await fetch(`/api/ordens-servico/${editingOrdem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao atualizar');
        toast.success('Ordem de serviço atualizada!');
      } else {
        const response = await fetch('/api/ordens-servico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao criar');
        toast.success('Ordem de serviço criada!');
      }
      setIsFormOpen(false);
      fetchOrdens();
    } catch (error) {
      toast.error('Erro ao salvar ordem de serviço');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/api/ordens-servico/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar');
      toast.success('Ordem de serviço excluída!');
      setDeleteTarget(null);
      fetchOrdens();
    } catch (error) {
      toast.error('Erro ao excluir ordem de serviço');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando ordens de serviço...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as ordens de serviço do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ordem
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por contrato, ordem, nome ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Contrato</TableHead>
              <TableHead>Data Contrato</TableHead>
              <TableHead>Ordem de Serviço</TableHead>
              <TableHead>Data OS</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor Negociado</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrdens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Nenhuma ordem encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrdens.map((ordem) => (
                <TableRow key={ordem.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{ordem.contrato}</TableCell>
                  <TableCell>{ordem.dataContrato}</TableCell>
                  <TableCell>{ordem.ordemServico}</TableCell>
                  <TableCell>{ordem.dataOrdemServico}</TableCell>
                  <TableCell>{ordem.nome}</TableCell>
                  <TableCell>{ordem.cliente}</TableCell>
                  <TableCell className="text-right font-medium text-green-400">
                    {formatCurrency(ordem.valorNegociado)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10"
                        onClick={() => handleEdit(ordem)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                        onClick={() => setDeleteTarget(ordem)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <OrdemServicoFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        ordem={editingOrdem}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        count={1}
      />
    </div>
  );
}
