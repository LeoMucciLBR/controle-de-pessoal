import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Person, AreaAtuacao } from '@/types/person';
import { StatusBadge } from './StatusBadge';
import { Mail, Phone, Building2, FileText, Calendar, Briefcase } from 'lucide-react';
import { areasAtuacao } from '@/lib/mock-data';

interface PersonDetailModalProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonDetailModal({ person, open, onOpenChange }: PersonDetailModalProps) {
  if (!person) return null;

  const getAreaLabel = (value: string) => {
    return areasAtuacao.find((a) => a.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {person.nome
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{person.nome}</h2>
              <p className="text-sm font-normal text-muted-foreground">{person.cargo}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Status and Discipline */}
          <div className="flex items-center gap-3">
            <StatusBadge status={person.status} />
            <Badge variant="outline">{person.disciplina}</Badge>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <a href={`mailto:${person.email}`} className="text-sm font-medium hover:text-primary">
                  {person.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <a href={`tel:${person.telefone}`} className="text-sm font-medium hover:text-primary">
                  {person.telefone}
                </a>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="text-sm font-medium">{person.empresa}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Contrato</p>
                <p className="text-sm font-medium">{person.contrato}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">CPF</p>
                <p className="text-sm font-medium">{person.cpf}</p>
              </div>
            </div>
            {person.dataAdmissao && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Data de Admissão</p>
                  <p className="text-sm font-medium">
                    {new Date(person.dataAdmissao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Areas */}
          <div>
            <h4 className="text-sm font-medium mb-3">Áreas de Atuação</h4>
            <div className="flex flex-wrap gap-2">
              {person.areas.map((area) => (
                <Badge key={area} variant="secondary">
                  {getAreaLabel(area)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Competencies */}
          <div>
            <h4 className="text-sm font-medium mb-3">Competências</h4>
            <div className="flex flex-wrap gap-2">
              {person.competencias.map((comp) => (
                <Badge key={comp} variant="outline" className="bg-muted">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
