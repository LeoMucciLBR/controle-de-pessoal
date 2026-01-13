"use client"

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Calendar, User, Building2, DollarSign, Save } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

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

interface OrdemServicoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ordem: OrdemServico | null;
  onSave: (data: Partial<OrdemServico>) => void;
}

export function OrdemServicoFormModal({
  open,
  onOpenChange,
  ordem,
  onSave
}: OrdemServicoFormModalProps) {
  const { clientes } = useSettings();
  
  const [formData, setFormData] = useState({
    contrato: '',
    dataContrato: '',
    ordemServico: '',
    dataOrdemServico: '',
    nome: '',
    cliente: '',
    valorNegociado: '',
  });

  useEffect(() => {
    if (ordem) {
      setFormData({
        contrato: ordem.contrato,
        dataContrato: ordem.dataContrato,
        ordemServico: ordem.ordemServico,
        dataOrdemServico: ordem.dataOrdemServico,
        nome: ordem.nome,
        cliente: ordem.cliente,
        valorNegociado: ordem.valorNegociado.toString(),
      });
    } else {
      setFormData({
        contrato: '',
        dataContrato: '',
        ordemServico: '',
        dataOrdemServico: '',
        nome: '',
        cliente: '',
        valorNegociado: '',
      });
    }
  }, [ordem, open]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      valorNegociado: parseFloat(formData.valorNegociado) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            {ordem ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Contrato e Data do Contrato */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Contrato
              </Label>
              <Input
                value={formData.contrato}
                onChange={(e) => handleChange('contrato', e.target.value)}
                placeholder="Ex: 0042.23"
                className="h-11 bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Data do Contrato
              </Label>
              <Input
                type="date"
                value={formData.dataContrato}
                onChange={(e) => handleChange('dataContrato', e.target.value)}
                className="h-11 bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          {/* Ordem de Serviço e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Ordem de Serviço
              </Label>
              <Input
                value={formData.ordemServico}
                onChange={(e) => handleChange('ordemServico', e.target.value)}
                placeholder="Ex: 012"
                className="h-11 bg-white/5 border-white/10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Data da Ordem
              </Label>
              <Input
                type="date"
                value={formData.dataOrdemServico}
                onChange={(e) => handleChange('dataOrdemServico', e.target.value)}
                className="h-11 bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-3 h-3" />
              Nome
            </Label>
            <Input
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Ex: Mônica Gislaine Haenel"
              className="h-11 bg-white/5 border-white/10"
              required
            />
          </div>

          {/* Cliente e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                Cliente
              </Label>
              <Select value={formData.cliente} onValueChange={(v) => handleChange('cliente', v)}>
                <SelectTrigger className="h-11 bg-white/5 border-white/10">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-white/10">
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente} value={cliente}>
                      {cliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                Valor Negociado (R$)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.valorNegociado}
                onChange={(e) => handleChange('valorNegociado', e.target.value)}
                placeholder="Ex: 120.00"
                className="h-11 bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {ordem ? 'Salvar Alterações' : 'Criar Ordem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
