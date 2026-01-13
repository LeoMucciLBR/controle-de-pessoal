import { motion } from 'framer-motion';
import { Person } from '@/types/person';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Pencil,
  Trash2,
  Copy,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  Building2,
  FileText,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface PersonCardGridProps {
  people: Person[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onView: (person: Person) => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onDuplicate: (person: Person) => void;
}

export function PersonCardGrid({
  people,
  selectedIds,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}: PersonCardGridProps) {
  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (people.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
             <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
           <h3 className="text-lg font-semibold text-foreground">Nenhuma pessoa encontrada</h3>
           <p className="mt-1 text-sm text-muted-foreground">
             Tente ajustar os filtros ou adicione uma nova pessoa.
           </p>
         </div>
     );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {people.map((person) => (
        <motion.div
          key={person.id}
          variants={item}
          className={cn(
            "group relative flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer",
            selectedIds.includes(person.id)
              ? "border-primary bg-primary/5"
              : "bg-card border-border"
          )}
          style={{ backgroundColor: '#1e293b', borderColor: selectedIds.includes(person.id) ? '#2f4982' : '#334155' }}
          onClick={() => onView(person)}
        >
          {/* Selection Checkbox (absolute positioned) */}
          <div className="absolute right-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(person)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(person)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(person)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
          </div>
            
          <div className="absolute left-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
             <Checkbox
                checked={selectedIds.includes(person.id)}
                onCheckedChange={() => toggleOne(person.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
             />
          </div>

          <div className="flex flex-col items-center text-center mt-6 w-full">
               <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary shadow-inner mb-3 shrink-0">
                 {person.nome
                   .split(' ')
                   .map((n) => n[0])
                   .slice(0, 2)
                   .join('')}
               </div>
               
               <div className="mb-4 w-full flex justify-center min-h-[24px] border border-red-500/50">
                 <StatusBadge status={person.status} />
               </div>

            <h3 className="mb-1 truncate text-lg font-semibold text-foreground w-full px-2">
              {person.nome}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              {person.cargo}
            </p>

            <div className="w-full space-y-2.5 rounded-lg bg-muted/30 p-3 mb-4 border border-border/50">
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-muted-foreground">
                   <Building2 className="h-3.5 w-3.5" />
                   Empresa
                 </span>
                 <span className="font-medium text-foreground truncate max-w-[120px]">{person.empresa}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-muted-foreground">
                   <FileText className="h-3.5 w-3.5" />
                   Contrato
                 </span>
                 <span className="font-medium text-foreground truncate max-w-[120px]">{person.contrato}</span>
               </div>
            </div>

            <div className="w-full mt-auto space-y-3 pt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group/link" onClick={() => window.open(`mailto:${person.email}`)}>
                 <Mail className="h-3.5 w-3.5 shrink-0 group-hover/link:text-primary" />
                 <span className="truncate max-w-[200px]">{person.email}</span>
               </div>
               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group/link" onClick={() => window.open(`tel:${person.telefone}`)}>
                 <Phone className="h-3.5 w-3.5 shrink-0 group-hover/link:text-primary" />
                 <span>{person.telefone}</span>
               </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
