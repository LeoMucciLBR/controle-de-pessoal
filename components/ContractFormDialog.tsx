import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonContractType } from '@/types/person';
import { FileText, Calendar } from 'lucide-react';

interface ContractFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contract: PersonContractType) => void;
  contractToEdit?: PersonContractType | null;
  type: string;
}

export function ContractFormDialog({
  open,
  onOpenChange,
  onSave,
  contractToEdit,
  type
}: ContractFormDialogProps) {
  const [formData, setFormData] = useState<Partial<PersonContractType>>({
    nome: '',
    data: ''
  });

  useEffect(() => {
    if (contractToEdit) {
      setFormData({ 
        id: contractToEdit.id,
        nome: contractToEdit.nome,
        data: contractToEdit.data,
        tipo: contractToEdit.tipo
      });
    } else {
      setFormData({
        nome: '',
        data: '',
        tipo: type
      });
    }
  }, [contractToEdit, type, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.data) return;

    onSave({
      id: formData.id,
      tipo: type, // Ensure type is preserved
      nome: formData.nome,
      data: formData.data
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>
            {contractToEdit ? 'Editar Contrato' : 'Adicionar Contrato'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {type}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome / OS / Contrato</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="pl-9 bg-zinc-800/50 border-white/10"
                placeholder="Ex: CT. 0075/23"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                className="pl-9 bg-zinc-800/50 border-white/10"
                type="date"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
