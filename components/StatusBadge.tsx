import { PersonStatus } from '@/types/person';
import { cn } from '@/lib/utils';

const statusConfig: Record<PersonStatus, { label: string; className: string }> = {
  ativo: {
    label: 'Ativo',
    className: 'bg-green-500 text-white border-green-500'
  },
  inativo: {
    label: 'Inativo',
    className: 'bg-[#FF0000] text-white border-red-500'
  },
  banco_de_dados: {
    label: 'Banco de Dados',
    className: 'bg-blue-500 text-white border-blue-500'
  },
  baixa_frequencia: {
    label: 'Baixa Frequência',
    className: 'bg-yellow-500 text-white border-yellow-500'
  }
};

interface StatusBadgeProps {
  status: PersonStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap min-w-max',
        config.className,
        className
      )}
      style={{ whiteSpace: 'nowrap' }}
    >
      {config.label}
    </span>
  );
}
