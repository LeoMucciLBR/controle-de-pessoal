import { PersonStatus } from '@/types/person';
import { cn } from '@/lib/utils';

// Mapeia valores do banco para configuração de exibição
// Suporta múltiplos formatos: snake_case e com espaços
const statusConfig: Record<string, { label: string; className: string }> = {
  // Formato snake_case
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
  },
  // Formato com espaços (como está no banco de dados)
  'banco de dados': {
    label: 'Banco de Dados',
    className: 'bg-blue-500 text-white border-blue-500'
  },
  'baixa frequencia': {
    label: 'Baixa Frequência',
    className: 'bg-yellow-500 text-white border-yellow-500'
  }
};

const defaultConfig = {
  label: 'Desconhecido',
  className: 'bg-gray-500 text-white border-gray-500'
};

interface StatusBadgeProps {
  status?: PersonStatus | string | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Normaliza o status para lowercase para comparação
  const normalizedStatus = status?.toLowerCase().trim();
  const config = normalizedStatus && statusConfig[normalizedStatus] 
    ? statusConfig[normalizedStatus] 
    : defaultConfig;

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
