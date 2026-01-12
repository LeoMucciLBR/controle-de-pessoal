import { Trash2, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Changed from original relative path

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
  onExportSelected,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border bg-card px-6 py-3 shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="text-sm font-medium">Selecionados</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeleteSelected}
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>

        <Button variant="ghost" size="sm" onClick={onExportSelected}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="ml-2 h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
