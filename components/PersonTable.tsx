import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  ArrowUpDown,
  Mail,
  Phone,
} from 'lucide-react';
import { Person } from '@/types/person';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface PersonTableProps {
  people: Person[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onView: (person: Person) => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onDuplicate: (person: Person) => void;
}

export function PersonTable({
  people,
  selectedIds,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}: PersonTableProps) {
  const [sortField, setSortField] = useState<keyof Person | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const allSelected = people.length > 0 && selectedIds.length === people.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < people.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(people.map((p) => p.id));
    }
  };

  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSort = (field: keyof Person) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPeople = [...people].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof Person;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Nenhuma pessoa encontrada</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tente ajustar os filtros ou adicione uma nova pessoa.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(ref) => {
                  if (ref) {
                    (ref as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>
              <SortableHeader field="nome">Nome</SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader field="cargo">Cargo</SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader field="status">Status</SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader field="empresa">Empresa</SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader field="contrato">Contrato</SortableHeader>
            </TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPeople.map((person, index) => (
            <TableRow
              key={person.id}
              className={cn(
                'transition-colors animate-fade-in',
                selectedIds.includes(person.id) && 'bg-primary/5'
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(person.id)}
                  onCheckedChange={() => toggleOne(person.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                    {person.nome
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-medium">{person.nome}</p>
                    <p className="text-xs text-muted-foreground">{person.cpf}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm">{person.cargo}</p>
                <p className="text-xs text-muted-foreground">{person.disciplina}</p>
              </TableCell>
              <TableCell>
                <StatusBadge status={person.status} />
              </TableCell>
              <TableCell className="text-sm">{person.empresa}</TableCell>
              <TableCell className="text-sm">{person.contrato}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    {person.email}
                  </a>
                  <a
                    href={`tel:${person.telefone}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-3 w-3" />
                    {person.telefone}
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                    <DropdownMenuItem onClick={() => onDuplicate(person)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
