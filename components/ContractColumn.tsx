import { Plus, Pencil, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonContractType } from '@/types/person';


interface ContractColumnProps {
  type: string;
  contracts: PersonContractType[];
  onAdd?: (type: string) => void;
  onEdit?: (contract: PersonContractType) => void;
  onDelete?: (contract: PersonContractType) => void;
  color?: string;
  readOnly?: boolean;
}

export function ContractColumn({ 
  type, 
  contracts = [], 
  onAdd, 
  onEdit, 
  onDelete,
  color = "bg-primary",
  readOnly = false
}: ContractColumnProps) {
  const hasActions = !readOnly && onAdd && onEdit && onDelete;
  
  return (
    <div className="flex flex-col h-full min-w-[280px] w-full max-w-sm rounded-xl border border-white/5 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className={`p-3 border-b border-white/5 flex items-center justify-between ${color}/10`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="font-medium text-sm text-foreground">{type}</h3>
          <span className="text-xs text-muted-foreground bg-black/20 px-1.5 py-0.5 rounded">
            {contracts.length}
          </span>
        </div>
        {hasActions && onAdd && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-white/10"
            onClick={() => onAdd(type)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar max-h-[300px]">
        {contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-white/5 rounded-lg">
            <FileText className="w-8 h-8 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground">Nenhum contrato</p>
            {hasActions && onAdd && (
              <Button 
                variant="link" 
                className="text-xs h-auto p-0 mt-1 text-primary/80"
                onClick={() => onAdd(type)}
              >
                Adicionar
              </Button>
            )}
          </div>
        ) : (
          contracts.map((contract, idx) => (
            <div 
              key={contract.id || idx} // Fallback to idx if new (no id yet)
              className="group relative p-3 rounded-lg bg-black/20 hover:bg-black/30 border border-white/5 transition-all hover:border-white/10"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white break-words line-clamp-2" title={contract.nome}>
                    {contract.nome}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {contract.data ? (
                        // Manual format DD/MM/YYYY setup
                        (() => {
                            if (contract.data.includes('/')) return contract.data;
                            if (contract.data.includes('-')) {
                                const [y, m, d] = contract.data.split('-');
                                return `${d}/${m}/${y}`;
                            }
                            return contract.data;
                        })()
                      ) : '-'}
                    </span>
                  </div>
                </div>

                {hasActions && onEdit && onDelete && (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:bg-white/10 hover:text-blue-400"
                      onClick={() => onEdit(contract)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:bg-white/10 hover:text-red-400"
                      onClick={() => onDelete(contract)}
                      type="button"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
