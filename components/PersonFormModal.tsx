import { useEffect, useState } from 'react';
import { Person, PersonStatus, Contrato, Disciplina, AreaAtuacao } from '@/types/person';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Building2, FileText, Briefcase, Plus, Trash2, Check, X, ChevronRight, LayoutGrid } from 'lucide-react';
import { areasAtuacao, empresas, contratos } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PersonFormModalProps {
  person?: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (person: Person) => void;
}

const emptyPerson: Partial<Person> = {
  nome: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  endereco: '',
  cargo: '',
  empresa: '',
  contrato: 'CONTRATO GLOBAL',
  contratosAtivos: [],
  status: 'ativo',
  disciplina: 'PROJETO',
  areas: [],
  competencias: [],
  disciplinasProjeto: [],
  disciplinasObra: [],
  treinamentos: [],
  historicoProfissional: '',
  termoConfidencialidade: false,
  apresentouCartaoCnpj: false,
  certidaoQuitacaoPf: false,
  certidaoQuitacaoPj: false,
  curriculo: false,
};

// Mock lists
const disciplinasProjetoList = [
    "AR CONDICIONADO", "ARQUITETURA", "AUTOMAÇÃO", "BIM", "CONTENÇÃO", "CRONOGRAMA", 
    "DESAPROPRIAÇÃO", "DRENAGEM", "ELÉTRICA", "ESTRUTURAL", "GEOTECNIA", "GEOMETRIA", 
    "HIDRAÚLICA", "INCÊNDIO", "MEIO AMBIENTE", "MECÂNICA", "ORÇAMENTO", "PAISAGISMO", 
    "PAVIMENTAÇÃO", "TOPOGRAFIA", "SINALIZAÇÃO"
];

const disciplinasObraList = [
    "PLANEJAMENTO", "AUTOMAÇÃO", "FISCALIZAÇÃO DE OBRA", "DOCUMENTAÇÃO", 
    "OBRA DE SANEAMENTO", "ORÇAMENTO", "BARRAGEM", "SAÚDE E SEGURANÇA", 
    "OAE", "ELÉTRICA", "LABORATORISTA"
];

const fadeIn = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.1 } }
} as const;

export function PersonFormModal({ person, open, onOpenChange, onSave }: PersonFormModalProps) {
  const [formData, setFormData] = useState<Partial<Person>>(emptyPerson);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (person) {
      setFormData({ ...person });
    } else {
      setFormData({ ...emptyPerson });
      setActiveTab("personal");
    }
  }, [person, open]);

  const handleChange = (field: keyof Person, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof Person, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
  }

  const handleMultiSelect = (field: 'areas' | 'disciplinasProjeto' | 'disciplinasObra' | 'contratosAtivos', item: string, checked: boolean) => {
      setFormData((prev) => {
          const current = (prev[field] as string[]) || [];
          if (checked) {
              return { ...prev, [field]: [...current, item] };
          } else {
              return { ...prev, [field]: current.filter(i => i !== item) };
          }
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Person);
    onOpenChange(false);
  };

  const navItems = [
      { id: 'personal', label: 'Dados Pessoais', icon: User, description: 'Identificação e contato' },
      { id: 'company', label: 'Corporativo', icon: Building2, description: 'Vínculos e contratos' },
      { id: 'technical', label: 'Técnico', icon: LayoutGrid, description: 'Áreas e disciplinas' },
      { id: 'docs', label: 'Documentação', icon: FileText, description: 'Jurídico e certidões' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl flex">
        
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 bg-[#0c0c0e] flex flex-col">
            <div className="p-6">
                <h2 className="text-lg font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    {person ? 'Editar Cadastro' : 'Novo Cadastro'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Preencha os dados do profissional.</p>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group relative overflow-hidden",
                                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground")} />
                            <div>
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                                <div className="text-[10px] opacity-60 mt-0.5 font-light">{item.description}</div>
                            </div>
                        </button>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/20">
                        {formData.nome ? formData.nome.substring(0,2).toUpperCase() : 'NO'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-xs font-medium truncate text-foreground">{formData.nome || 'Novo Usuário'}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{formData.email || 'Sem email'}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 flex flex-col bg-[#09090b] relative">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'personal' && (
                            <motion.div key="personal" {...fadeIn} className="max-w-3xl mx-auto space-y-8">
                                <SectionHeader title="Informações Pessoais" description="Dados básicos de identificação e contato do profissional." />
                                
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-8">
                                        <ModernInput label="Nome Completo" value={formData.nome} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nome', e.target.value)} required placeholder="Ex: João da Silva" />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <ModernInput label="CPF" value={formData.cpf} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cpf', e.target.value)} required placeholder="000.000.000-00" mask="cpf"/>
                                    </div>
                                    
                                    <div className="col-span-12 md:col-span-4">
                                        <ModernInput label="RG" value={formData.rg || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('rg', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <ModernInput label="Data de Nascimento" type="date" value={formData.dataNascimento || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dataNascimento', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <ModernInput label="Telefone" value={formData.telefone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('telefone', e.target.value)} placeholder="(00) 00000-0000" />
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <ModernInput label="Email Profissional" type="email" value={formData.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)} required placeholder="nome@empresa.com" />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernInput label="Endereço Completo" value={formData.endereco || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('endereco', e.target.value)} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'company' && (
                            <motion.div key="company" {...fadeIn} className="max-w-3xl mx-auto space-y-8">
                                <SectionHeader title="Vínculo Corporativo" description="Detalhes sobre a contratação, cargo e empresa." />
                                
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernSelect label="Empresa" value={formData.empresa} onChange={(v) => handleChange('empresa', v)} options={empresas} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernInput label="Cargo" value={formData.cargo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cargo', e.target.value)} required />
                                    </div>
                                    
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernSelect label="Contrato Principal" value={formData.contrato} onChange={(v) => handleChange('contrato', v)} options={contratos} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernInput label="Formação Acadêmica" value={formData.formacao || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('formacao', e.target.value)} />
                                    </div>

                                    <Separator className="col-span-12 bg-white/5 my-2" />
                                    
                                    <div className="col-span-12 md:col-span-4">
                                         <ModernInput label="Data de Admissão" type="date" value={formData.dataAdmissao || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dataAdmissao', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                         <ModernInput label="Vigência Início" type="date" value={formData.vigenciaInicio || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vigenciaInicio', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                         <ModernInput label="Vigência Fim" type="date" value={formData.vigenciaFim || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vigenciaFim', e.target.value)} />
                                    </div>

                                    <div className="col-span-12 mt-4">
                                        <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contratos Ativos</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {contratos.map(c => (
                                                <ModernChip 
                                                    key={c} 
                                                    label={c} 
                                                    selected={formData.contratosAtivos?.includes(c) || false} 
                                                    onClick={() => handleMultiSelect('contratosAtivos', c, !formData.contratosAtivos?.includes(c))} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'technical' && (
                            <motion.div key="technical" {...fadeIn} className="max-w-3xl mx-auto space-y-8">
                                <SectionHeader title="Perfil Técnico" description="Competências, disciplinas e áreas de atuação." />
                                
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernSelect label="Status Atual" value={formData.status} onChange={(v) => handleChange('status', v)} 
                                            options={['ativo', 'inativo', 'banco_de_dados', 'baixa_frequencia']} 
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <ModernSelect label="Disciplina Principal" value={formData.disciplina} onChange={(v) => handleChange('disciplina', v)} 
                                            options={['PROJETO', 'OBRA']} 
                                        />
                                    </div>
                                    <div className="col-span-12">
                                         <ModernInput label="Resumo Profissional" value={formData.historicoProfissional || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('historicoProfissional', e.target.value)} />
                                    </div>

                                    <div className="col-span-12">
                                        <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Áreas de Atuação</Label>
                                        <div className="flex flex-wrap gap-2">
                                             {areasAtuacao.map(area => (
                                                 <ModernChip 
                                                    key={area.value} 
                                                    label={area.label} 
                                                    selected={formData.areas?.includes(area.value as AreaAtuacao) || false} 
                                                    onClick={() => handleMultiSelect('areas', area.value as AreaAtuacao, !formData.areas?.includes(area.value as AreaAtuacao))} 
                                                />
                                             ))}
                                        </div>
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <div className="bg-[#121214] border border-white/5 rounded-xl p-4 h-[300px] flex flex-col">
                                            <Label className="text-sm font-medium mb-3 text-primary">Disciplinas de Projeto</Label>
                                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                                                {disciplinasProjetoList.map(d => (
                                                    <NavikeItem 
                                                        key={d} 
                                                        label={d} 
                                                        checked={formData.disciplinasProjeto?.includes(d) || false} 
                                                        onChange={(c) => handleMultiSelect('disciplinasProjeto', d, c)} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-12 md:col-span-6">
                                        <div className="bg-[#121214] border border-white/5 rounded-xl p-4 h-[300px] flex flex-col">
                                            <Label className="text-sm font-medium mb-3 text-primary">Disciplinas de Obra</Label>
                                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                                                {disciplinasObraList.map(d => (
                                                    <NavikeItem 
                                                        key={d} 
                                                        label={d} 
                                                        checked={formData.disciplinasObra?.includes(d) || false} 
                                                        onChange={(c) => handleMultiSelect('disciplinasObra', d, c)} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'docs' && (
                            <motion.div key="docs" {...fadeIn} className="max-w-3xl mx-auto space-y-8">
                                <SectionHeader title="Documentação" description="Informações jurídicas, fiscais e de conselho de classe." />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-[#121214] border border-white/5">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><FileText className="w-5 h-5"/></div>
                                            <h3 className="font-semibold text-foreground">Jurídico e Fiscal</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <ToggleSwitch label="Assinou Termo de Confidencialidade" checked={formData.termoConfidencialidade} onChange={c => handleCheckboxChange('termoConfidencialidade', c)} />
                                            <Separator className="bg-white/5" />
                                            <ToggleSwitch label="Apresentou Cartão CNPJ" checked={formData.apresentouCartaoCnpj} onChange={c => handleCheckboxChange('apresentouCartaoCnpj', c)} />
                                            <div className="pt-2">
                                                <ModernInput label="Número do CNPJ" value={formData.numeroCnpj || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroCnpj', e.target.value)} placeholder="00.000.000/0000-00" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-[#121214] border border-white/5">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Briefcase className="w-5 h-5"/></div>
                                            <h3 className="font-semibold text-foreground">Conselho de Classe</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <ModernInput label="Conselho (CREA/CAU)" value={formData.conselhoClasse || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('conselhoClasse', e.target.value)} />
                                            <div className="grid grid-cols-2 gap-3">
                                                 <ModernInput label="Nº Registro" value={formData.numeroRegistroConselho || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroRegistroConselho', e.target.value)} />
                                                 <ModernInput label="Ano Registro" type="number" value={formData.anoRegistroConselho || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('anoRegistroConselho', parseInt(e.target.value) || undefined)} />
                                            </div>
                                            <Separator className="bg-white/5" />
                                            <ToggleSwitch label="Certidão Quitação PF" checked={formData.certidaoQuitacaoPf} onChange={c => handleCheckboxChange('certidaoQuitacaoPf', c)} />
                                            <ToggleSwitch label="Certidão Quitação PJ" checked={formData.certidaoQuitacaoPj} onChange={c => handleCheckboxChange('certidaoQuitacaoPj', c)} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer fixed at bottom right of content area */}
                <div className="p-6 border-t border-white/5 bg-[#0c0c0e] flex justify-end gap-3 order-last">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-white/5">Cancelar</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white min-w-[140px] shadow-lg shadow-primary/20">
                        {person ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                    </Button>
                </div>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Modern Components ---

function SectionHeader({title, description}: {title: string, description: string}) {
    return (
        <div className="mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
        </div>
    )
}

function ModernInput({ label, id, className, mask, ...props }: any) {
    return (
        <div className={cn("group space-y-1.5", className)}>
            <Label htmlFor={id} className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider">{label}</Label>
            <div className="relative">
                <Input 
                    id={id} 
                    className="h-10 rounded-lg border-white/10 bg-white/5 focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 text-sm placeholder:text-muted-foreground/30 shadow-sm" 
                    {...props} 
                />
            </div>
        </div>
    );
}

function ModernSelect({ label, value, onChange, options }: { label: string, value: any, onChange: (v: string) => void, options: string[] }) {
    return (
        <div className="group space-y-1.5">
             <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider">{label}</Label>
             <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-10 rounded-lg border-white/10 bg-white/5 focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 shadow-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#121214] border border-white/10">
                    {options.map(opt => <SelectItem key={opt} value={opt} className="focus:bg-white/10 cursor-pointer">{opt}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    )
}

function ModernChip({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <button 
            type="button" 
            onClick={onClick}
            className={cn(
                "h-8 px-3 rounded-md text-xs font-medium border transition-all duration-200 select-none flex items-center gap-1.5",
                selected 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20" 
                    : "bg-white/5 border-transparent hover:bg-white/10 text-muted-foreground hover:text-foreground hover:border-white/10"
            )}
        >
            {selected ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current opacity-30" />}
            {label}
        </button>
    )
}

function NavikeItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <div 
            onClick={() => onChange(!checked)}
            className={cn(
                "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all group",
                 checked ? "bg-primary/10" : "hover:bg-white/5"
            )}
        >
            <span className={cn("text-xs transition-colors", checked ? "font-medium text-primary" : "text-muted-foreground group-hover:text-foreground")}>{label}</span>
            {checked && <motion.div layoutId="check" initial={{scale: 0}} animate={{scale: 1}}><Check className="w-3 h-3 text-primary" /></motion.div>}
        </div>
    )
}

function ToggleSwitch({ label, checked, onChange }: { label: string, checked?: boolean, onChange: (c: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-1">
            <Label className="cursor-pointer font-normal text-sm text-foreground/80" onClick={() => onChange(!checked)}>{label}</Label>
            <div 
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-300",
                    checked ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                )}
            >
                <div className={cn(
                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 shadow-sm",
                    checked ? "left-[calc(100%-16px)]" : "left-1"
                )} />
            </div>
        </div>
    )
}
