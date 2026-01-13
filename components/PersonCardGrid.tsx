import { motion } from 'framer-motion';
import { Person } from '@/types/person';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase,
  Building2,
  FileText,
  MapPin,
  Hammer,
  DraftingCompass
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
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
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
        <motion.div key={person.id} variants={item}>
          <Card 
            className={cn(
                "group relative h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer overflow-hidden ring-1 ring-transparent hover:ring-primary/20",
                selectedIds.includes(person.id)
                  ? "border-primary bg-primary/5"
                  : "bg-card border-border"
            )}
            onClick={() => onView(person)}
          >
            {/* Selection & Actions */}
            <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background text-muted-foreground hover:text-foreground rounded-full shadow-sm">
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
            
            <div className="absolute left-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                checked={selectedIds.includes(person.id)}
                onCheckedChange={() => toggleOne(person.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary bg-background/80 backdrop-blur-sm"
                />
            </div>

            {/* Always show selection controls if selected */}
            {(selectedIds.includes(person.id)) && (
               <style dangerouslySetInnerHTML={{__html: `
                 .group .absolute.z-10 { opacity: 1 !important; }
               `}} />
            )}

            <CardHeader className="items-center pb-2 pt-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-primary shadow-inner mb-3 transition-transform duration-300 group-hover:scale-110 relative z-10 ring-2 ring-background">
                    {person.nome
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground text-center line-clamp-1 w-full px-2" title={person.nome}>
                    {person.nome}
                </h3>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {person.cargo}
                    </p>
                    <StatusBadge status={person.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-4 px-4 flex-grow">
                {/* Empresa */}
                <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                    <span className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    Empresa
                    </span>
                    <span className="font-medium text-foreground truncate max-w-[140px]" title={person.empresa}>{person.empresa}</span>
                </div>

                {/* Contratos Info */}
                <div className="space-y-2">
                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <FileText className="h-3 w-3" />
                        Contratos
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                        {person.contratosDetalhados && person.contratosDetalhados.length > 0 ? (
                            person.contratosDetalhados.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto bg-muted/50 border-border font-normal text-start">
                                    <span className="font-semibold text-foreground/80 mr-1">{c.tipo}:</span> {c.nome}
                                </Badge>
                            ))
                        ) : (
                             <Badge variant="outline" className="text-[10px] bg-muted/30 font-normal">
                                {person.contrato || 'Sem contrato'}
                             </Badge>
                        )}
                    </div>
                </div>

                {/* Areas Info */}
                {(person.areasDetalhes || (person.areas && person.areas.length > 0)) && (
                    <div className="space-y-2">
                        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <MapPin className="h-3 w-3" />
                            Áreas
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {person.areasDetalhes ? (
                                Object.entries(person.areasDetalhes).map(([area, activities]) => (
                                    <Badge key={area} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto font-normal">
                                        {area}
                                        {activities && activities.length > 0 && (
                                            <span className="ml-1 text-muted-foreground opacity-70">
                                                ({Array.isArray(activities) ? activities.map(a => a === 'PROJETO' ? 'P' : 'O').join('/') : ''})
                                            </span>
                                        )}
                                    </Badge>
                                ))
                            ) : (
                                person.areas?.map((area) => (
                                    <Badge key={area} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto font-normal">
                                        {area}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 pb-4 px-4 bg-muted/20 border-t border-border/40 mt-auto" onClick={(e) => e.stopPropagation()}>
               <div className="w-full space-y-2">
                   {person.email && (
                    <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate block group/link">
                        <Mail className="h-3.5 w-3.5 shrink-0 group-hover/link:text-primary" />
                        <span className="truncate">{person.email}</span>
                    </a>
                   )}
                   {person.telefone && (
                    <a href={`tel:${person.telefone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors truncate block group/link">
                        <Phone className="h-3.5 w-3.5 shrink-0 group-hover/link:text-primary" />
                        <span className="truncate">{person.telefone}</span>
                    </a>
                   )}
               </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
