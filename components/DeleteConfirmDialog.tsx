"use client"

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
}

// Senha de administrador para confirmar exclusão
const ADMIN_PASSWORD = 'admin123';

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
}: DeleteConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (password === ADMIN_PASSWORD) {
      setPassword('');
      setError('');
      onConfirm();
    } else {
      setError('Senha de administrador incorreta');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-background border border-white/10">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <AlertDialogTitle className="text-lg">Confirmar Exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            Essa ação irá marcar {count} registro(s) como excluído(s). 
            Os registros não aparecerão mais nas visualizações, mas permanecerão no banco de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-3">
          <Label htmlFor="admin-password" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Senha de Administrador
          </Label>
          <Input
            id="admin-password"
            type="password"
            placeholder="Digite a senha de administrador"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
            className="h-11 bg-white/5 border-white/10"
          />
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 hover:bg-white/5">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
