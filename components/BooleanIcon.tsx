import { Check, X } from 'lucide-react';

export function BooleanIcon({ value }: { value?: boolean }) {
  if (value) {
    return <Check className="h-4 w-4 text-green-500" />;
  }
  return <X className="h-4 w-4 text-red-500" />;
}
