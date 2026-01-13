import { useEffect, useState, useCallback } from 'react';
import { Person, PersonStatus, Contrato, Disciplina, AreaAtuacao, PersonContractType } from '@/types/person';
import { ContractColumn } from './ContractColumn';
import { ContractFormDialog } from './ContractFormDialog';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { 
  User, 
  Building2, 
  FileText, 
  Briefcase, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronRight, 
  LayoutGrid,
  Sparkles,
  Shield,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Hash,
  Award
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
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

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
} as const;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export function PersonFormModal({ person, open, onOpenChange, onSave }: PersonFormModalProps) {
  const { 
      empresas, 
      contratos, 
      disciplinasProjeto, 
      disciplinasObra, 
      areas: areasList, 
      treinamentos: treinamentosList
  } = useSettings();

  const [formData, setFormData] = useState<Partial<Person>>(emptyPerson);
  const [activeTab, setActiveTab] = useState("personal");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Contract Management State
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [contractTypeToAdd, setContractTypeToAdd] = useState('');
  const [contractToEdit, setContractToEdit] = useState<PersonContractType | null>(null);

  const handleAddContract = (type: string) => {
    setContractTypeToAdd(type);
    setContractToEdit(null);
    setContractDialogOpen(true);
  };

  const handleEditContract = (contract: PersonContractType) => {
    setContractTypeToAdd(contract.tipo);
    setContractToEdit(contract);
    setContractDialogOpen(true);
  };

  const handleSaveContract = (contract: PersonContractType) => {
    setFormData(prev => {
        const current = prev.contratosDetalhados || [];
        let updated;

        if (contractToEdit) {
            // Edit existing
            updated = current.map(c => {
                 if (contractToEdit.id && c.id === contractToEdit.id) return { ...contract, id: c.id };
                 if ((c as any)._tempId && (c as any)._tempId === (contractToEdit as any)._tempId) return { ...contract, _tempId: (c as any)._tempId };
                 return c;
            });
        } else {
            // Add new
            updated = [...current, { ...contract, _tempId: Date.now() }];
        }
        return { ...prev, contratosDetalhados: updated };
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteContract = (contract: PersonContractType) => {
     setFormData(prev => ({
         ...prev,
         contratosDetalhados: (prev.contratosDetalhados || []).filter(c => {
             if (contract.id) return c.id !== contract.id;
             return (c as any)._tempId !== (contract as any)._tempId;
         })
     }));
     setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (person) {
      // Ensure contratosAtivos reflects detailed contracts if missing (migration/fallback logic)
      let initialContratosAtivos = person.contratosAtivos || [];
      if (initialContratosAtivos.length === 0 && person.contratosDetalhados && person.contratosDetalhados.length > 0) {
           initialContratosAtivos = Array.from(new Set(person.contratosDetalhados.map(c => c.tipo)));
      }
      
      setFormData({ ...person, contratosAtivos: initialContratosAtivos });
    } else {
      setFormData({ ...emptyPerson });
      setActiveTab("personal");
    }
    setHasUnsavedChanges(false);
  }, [person, open]);

  // Detectar mudanças no formulário
  const handleChangeWithDirty = useCallback((field: keyof Person, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  // Interceptar fechamento do modal
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onOpenChange(newOpen);
    }
  }, [hasUnsavedChanges, onOpenChange]);

  const confirmExit = () => {
    setShowExitConfirm(false);
    setHasUnsavedChanges(false);
    onOpenChange(false);
  };

  const handleChange = (field: keyof Person, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleCheckboxChange = (field: keyof Person, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
      setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(false);
    onSave(formData as Person);
    onOpenChange(false);
  };

  const navItems = [
      { id: 'personal', label: 'Dados Pessoais', icon: User, description: 'Identificação e contato', color: 'from-blue-500 to-cyan-500' },
      { id: 'company', label: 'Corporativo', icon: Building2, description: 'Vínculos e contratos', color: 'from-purple-500 to-pink-500' },
      { id: 'technical', label: 'Técnico', icon: LayoutGrid, description: 'Áreas e disciplinas', color: 'from-amber-500 to-orange-500' },
      { id: 'docs', label: 'Documentação', icon: FileText, description: 'Jurídico e certidões', color: 'from-emerald-500 to-teal-500' },
  ];

  const currentTabIndex = navItems.findIndex(item => item.id === activeTab);
  const progressPercentage = ((currentTabIndex + 1) / navItems.length) * 100;

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-none flex flex-col md:flex-row items-stretch">
        <DialogTitle className="sr-only">
            {person ? 'Editar Cadastro' : 'Novo Cadastro'}
        </DialogTitle>
        <DialogDescription className="sr-only">
            Formulário para {person ? 'editar' : 'criar'} registro de pessoa.
        </DialogDescription>
        
        {/* Glass Container */}
        <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-gradient-to-b from-background/95 to-background shadow-2xl shadow-black/50">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col min-h-[120px] md:min-h-[550px] relative overflow-hidden">
              {/* Decorative gradient orb */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="p-6 border-b border-white/5 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                          {person ? 'Editar Registro' : 'Novo Cadastro'}
                      </h2>
                      <div className="text-xs text-muted-foreground font-mono">
                          {person ? `ID #${person.id}` : 'Preencha os dados'}
                      </div>
                    </div>
                  </div>
              </div>
              
              {/* Progress indicator */}
              <div className="px-6 py-3 border-b border-white/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progresso</span>
                  <span className="font-medium text-primary">{currentTabIndex + 1} de {navItems.length}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
                  {navItems.map((item, index) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      const isCompleted = index < currentTabIndex;
                      
                      return (
                          <motion.button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveTab(item.id)}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden",
                                  isActive 
                                    ? "bg-gradient-to-r from-primary/20 to-primary/5 text-white shadow-lg shadow-primary/10 border border-primary/30" 
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                              )}
                          >
                              {/* Active indicator line */}
                              {isActive && (
                                  <motion.div 
                                    layoutId="activeTabIndicator" 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/40 rounded-r-full shadow-lg shadow-primary/50" 
                                  />
                              )}
                              
                              <div className={cn(
                                "p-2 rounded-lg transition-all duration-300",
                                isActive 
                                  ? `bg-gradient-to-br ${item.color} shadow-lg` 
                                  : isCompleted
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-white/5 group-hover:bg-white/10"
                              )}>
                                {isCompleted && !isActive ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Icon className={cn("w-4 h-4", isActive && "text-white")} />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <div className={cn(
                                    "text-sm font-medium leading-none truncate",
                                    isActive && "text-white"
                                  )}>{item.label}</div>
                                  <div className="text-[10px] opacity-60 mt-1 font-light truncate">{item.description}</div>
                              </div>
                              
                              <ChevronRight className={cn(
                                "w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100",
                                isActive && "opacity-100 text-primary"
                              )} />
                          </motion.button>
                      )
                  })}
              </nav>

              <div className="p-4 mt-auto border-t border-white/5 hidden md:block">
                 <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/20">
                     {/* Avatar */}
                     <div className="relative flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                         {formData.nome ? (
                           <span className="text-white text-sm font-bold uppercase">
                             {formData.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                           </span>
                         ) : (
                           <User className="w-5 h-5 text-white/80" />
                         )}
                       </div>
                       {/* Online indicator */}
                       <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                     </div>
                     {/* Info */}
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-foreground truncate">
                         {formData.nome || 'Nome do usuário'}
                       </p>
                       <p className="text-xs text-muted-foreground truncate">
                         {formData.email || 'email@exemplo.com'}
                       </p>
                     </div>
                 </div>
              </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-background h-full max-h-full relative overflow-hidden">
               {/* Background decorations */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
               
               <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-full relative overflow-hidden">
                  <div className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
                      <AnimatePresence mode="wait">
                          {activeTab === 'personal' && (
                              <motion.div key="personal" {...fadeIn} className="max-w-3xl mx-auto">
                                  <SectionHeader 
                                    title="Dados Pessoais" 
                                    description="Informações básicas de identificação e contato."
                                    icon={User}
                                    color="from-blue-500 to-cyan-500"
                                  />
                                  
                                  <motion.div 
                                    className="grid grid-cols-12 gap-5 mt-8"
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                  >
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-8">
                                          <ModernInput 
                                            label="Nome Completo" 
                                            id="nome" 
                                            value={formData.nome} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nome', e.target.value)} 
                                            required 
                                            autoFocus 
                                            icon={User}
                                            placeholder="Digite o nome completo"
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="CPF" 
                                            value={formData.cpf} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cpf', e.target.value)} 
                                            required 
                                            placeholder="000.000.000-00" 
                                            icon={CreditCard}
                                          />
                                      </motion.div>
                                      
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="RG" 
                                            value={formData.rg || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('rg', e.target.value)} 
                                            icon={Hash}
                                            placeholder="Número do RG"
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="Data de Nascimento" 
                                            type="date" 
                                            value={formData.dataNascimento || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dataNascimento', e.target.value)} 
                                            icon={Calendar}
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="Telefone" 
                                            value={formData.telefone} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('telefone', e.target.value)} 
                                            placeholder="(00) 00000-0000" 
                                            icon={Phone}
                                          />
                                      </motion.div>

                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <ModernInput 
                                            label="Email Profissional" 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)} 
                                            required 
                                            placeholder="nome@empresa.com" 
                                            icon={Mail}
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <ModernInput 
                                            label="Endereço Completo" 
                                            value={formData.endereco || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('endereco', e.target.value)} 
                                            icon={MapPin}
                                            placeholder="Rua, número, bairro, cidade"
                                          />
                                      </motion.div>
                                  </motion.div>
                              </motion.div>
                          )}

                          {activeTab === 'company' && (
                              <motion.div key="company" {...fadeIn} className="max-w-3xl mx-auto">
                                  <SectionHeader 
                                    title="Vínculo Corporativo" 
                                    description="Detalhes sobre a contratação, cargo e empresa."
                                    icon={Building2}
                                    color="from-purple-500 to-pink-500"
                                  />
                                  
                                  <motion.div 
                                    className="grid grid-cols-12 gap-5 mt-8"
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                  >
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <ModernSelect label="Empresa" value={formData.empresa} onChange={(v) => handleChange('empresa', v)} options={empresas} icon={Building2} />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <ModernInput 
                                            label="Cargo" 
                                            value={formData.cargo} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cargo', e.target.value)} 
                                            required 
                                            icon={Briefcase}
                                            placeholder="Ex: Engenheiro Civil"
                                          />
                                      </motion.div>
                                      
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <ModernInput 
                                            label="Formação Acadêmica" 
                                            value={formData.formacao || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('formacao', e.target.value)} 
                                            icon={GraduationCap}
                                            placeholder="Ex: Engenharia Civil"
                                          />
                                      </motion.div>

                                      {/* Contratos Ativos Selection - MOVED UP */}
                                      <motion.div variants={staggerItem} className="col-span-12 mt-4">
                                          <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Selecione os Contratos Ativos</Label>
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
                                      </motion.div>

                                      {/* Contratos Detalhados Section */}
                                      <motion.div variants={staggerItem} className="col-span-12 mt-4">
                                          {(!formData.contratosAtivos || formData.contratosAtivos.length === 0) ? (
                                             <div className="text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                                                 <p className="text-sm text-muted-foreground">Selecione um ou mais contratos ativos acima para gerenciar os detalhes.</p>
                                             </div>
                                          ) : (
                                              <>
                                                  <div className="flex items-center gap-2 mb-3 mt-2">
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                        <FileText className="w-3 h-3" />
                                                        Detalhes dos Contratos
                                                    </span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                  </div>
                                                  
                                                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x custom-scrollbar">
                                                      {contratos
                                                        .filter(tipo => formData.contratosAtivos?.includes(tipo))
                                                        .map((tipo) => (
                                                          <div key={tipo} className="snap-start shrink-0">
                                                              <ContractColumn 
                                                                  type={tipo}
                                                                  contracts={(formData.contratosDetalhados || []).filter(c => c.tipo === tipo)}
                                                                  onAdd={handleAddContract}
                                                                  onEdit={handleEditContract}
                                                                  onDelete={handleDeleteContract}
                                                                  color="bg-purple-500"
                                                              />
                                                          </div>
                                                      ))}
                                                  </div>
                                              </>
                                          )}
                                      </motion.div>

                                      <motion.div variants={staggerItem} className="col-span-12">
                                        <div className="flex items-center gap-2 mb-4">
                                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Período</span>
                                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        </div>
                                      </motion.div>
                                      
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="Data de Admissão" 
                                            type="date" 
                                            value={formData.dataAdmissao || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('dataAdmissao', e.target.value)} 
                                            icon={Calendar}
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="Vigência Início" 
                                            type="date" 
                                            value={formData.vigenciaInicio || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vigenciaInicio', e.target.value)} 
                                            icon={Calendar}
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-4">
                                          <ModernInput 
                                            label="Vigência Fim" 
                                            type="date" 
                                            value={formData.vigenciaFim || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vigenciaFim', e.target.value)} 
                                            icon={Calendar}
                                          />
                                      </motion.div>


                                  </motion.div>
                              </motion.div>
                          )}

                          {activeTab === 'technical' && (
                              <motion.div key="technical" {...fadeIn} className="max-w-3xl mx-auto">
                                  <SectionHeader 
                                    title="Perfil Técnico" 
                                    description="Competências, disciplinas e áreas de atuação."
                                    icon={LayoutGrid}
                                    color="from-amber-500 to-orange-500"
                                  />
                                  
                                  <motion.div 
                                    className="grid grid-cols-12 gap-5 mt-8"
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                  >
                                      <motion.div variants={staggerItem} className="col-span-12 md:col-span-6">
                                          <StatusSelect 
                                            label="Status Atual" 
                                            value={formData.status} 
                                            onChange={(v) => handleChange('status', v)} 
                                          />
                                      </motion.div>
                                      <motion.div variants={staggerItem} className="col-span-12">
                                          <Label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Áreas de Atuação & Detalhes</Label>
                                          <div className="flex flex-wrap gap-2 mb-4">
                                              {areasList.map(area => (
                                                  <ModernChip 
                                                      key={area.value} 
                                                      label={area.label} 
                                                      selected={formData.areas?.includes(area.value as AreaAtuacao) || false} 
                                                      onClick={() => handleMultiSelect('areas', area.value as AreaAtuacao, !formData.areas?.includes(area.value as AreaAtuacao))} 
                                                  />
                                              ))}
                                          </div>

                                          {/* Detalhamento por Área */}
                                          {(formData.areas || []).length > 0 && (
                                            <div className="space-y-3 mt-4">
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Definir Atuação por Área</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {(formData.areas || []).map(area => {
                                                        const areaLabel = areasList.find(a => a.value === area)?.label || area;
                                                        const detalhes = (formData.areasDetalhes?.[area] || []) as string[];
                                                        
                                                        const toggleDetalhe = (tipo: string, checked: boolean) => {
                                                            const newDetalhes = checked 
                                                                ? [...detalhes, tipo]
                                                                : detalhes.filter(t => t !== tipo);
                                                            
                                                            handleChange('areasDetalhes', {
                                                                ...(formData.areasDetalhes || {}),
                                                                [area]: newDetalhes
                                                            });
                                                        };

                                                        return (
                                                            <div key={area} className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
                                                                <span className="text-sm font-semibold text-white flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                    {areaLabel}
                                                                </span>
                                                                <div className="flex gap-4">
                                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                                        <Checkbox 
                                                                            checked={detalhes.includes('PROJETO')} 
                                                                            onCheckedChange={(c) => toggleDetalhe('PROJETO', c as boolean)}
                                                                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 w-4 h-4"
                                                                        />
                                                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Projeto</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                                        <Checkbox 
                                                                            checked={detalhes.includes('OBRA')} 
                                                                            onCheckedChange={(c) => toggleDetalhe('OBRA', c as boolean)}
                                                                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-4 h-4"
                                                                        />
                                                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Obra</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                          )}
                                      </motion.div>
                                      
                                      <motion.div variants={staggerItem} className="col-span-12">
                                          <ModernInput 
                                            label="Resumo Profissional" 
                                            value={formData.historicoProfissional || ''} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('historicoProfissional', e.target.value)} 
                                            icon={FileText}
                                            placeholder="Breve descrição da experiência profissional"
                                          />
                                      </motion.div>

                                      {/* Logic for showing Discipline Cards: Check if ANY area has PROJETO or OBRA selected */}
                                      {Object.values(formData.areasDetalhes || {}).some((d: any) => d.includes('PROJETO')) && (
                                          <motion.div variants={staggerItem} className="col-span-12 md:col-span-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                              <DisciplineCard 
                                                title="Disciplinas de Projeto"
                                                items={disciplinasProjeto}
                                                selectedItems={formData.disciplinasProjeto || []}
                                                onToggle={(d, checked) => handleMultiSelect('disciplinasProjeto', d, checked)}
                                                color="from-blue-500 to-cyan-500"
                                              />
                                          </motion.div>
                                      )}

                                      {Object.values(formData.areasDetalhes || {}).some((d: any) => d.includes('OBRA')) && (
                                          <motion.div variants={staggerItem} className="col-span-12 md:col-span-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                              <DisciplineCard 
                                                title="Disciplinas de Obra"
                                                items={disciplinasObra}
                                                selectedItems={formData.disciplinasObra || []}
                                                onToggle={(d, checked) => handleMultiSelect('disciplinasObra', d, checked)}
                                                color="from-orange-500 to-red-500"
                                              />
                                          </motion.div>
                                      )}

                                      {/* Treinamentos Section */}
                                      <motion.div variants={staggerItem} className="col-span-12">
                                        <div className="flex items-center gap-2 mb-4 mt-4">
                                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Treinamentos</span>
                                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        </div>
                                        
                                        <div className="space-y-4">
                                          {/* Lista de treinamentos adicionados */}
                                          {(formData.treinamentos || []).length > 0 && (
                                            <div className="space-y-2">
                                              {(formData.treinamentos || []).map((treinamento, index) => {
                                                // Parse do formato "NOME|DATA"
                                                const parts = treinamento.split('|');
                                                const nome = parts[0] || treinamento;
                                                const data = parts[1] || '';
                                                
                                                return (
                                                  <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                                                  >
                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                                                      <GraduationCap className="w-4 h-4 text-green-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-sm font-medium text-foreground truncate">{nome}</p>
                                                      {data && (
                                                        <p className="text-xs text-muted-foreground">
                                                          Realizado em: {new Date(data).toLocaleDateString('pt-BR')}
                                                        </p>
                                                      )}
                                                    </div>
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                      onClick={() => {
                                                        const updated = (formData.treinamentos || []).filter((_, i) => i !== index);
                                                        handleChange('treinamentos', updated);
                                                      }}
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                  </motion.div>
                                                );
                                              })}
                                            </div>
                                          )}
                                          
                                          {/* Formulário para adicionar novo treinamento */}
                                          <TrainingAddForm
                                            treinamentosList={treinamentosList}
                                            onAdd={(treinamento, data) => {
                                              const entry = data ? `${treinamento}|${data}` : treinamento;
                                              handleChange('treinamentos', [...(formData.treinamentos || []), entry]);
                                            }}
                                          />
                                        </div>
                                      </motion.div>
                                  </motion.div>
                              </motion.div>
                          )}

                          {activeTab === 'docs' && (
                              <motion.div key="docs" {...fadeIn} className="max-w-3xl mx-auto">
                                  <SectionHeader 
                                    title="Documentação" 
                                    description="Informações jurídicas, fiscais e de conselho de classe."
                                    icon={FileText}
                                    color="from-emerald-500 to-teal-500"
                                  />
                                  
                                  <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                  >
                                      <motion.div variants={staggerItem}>
                                        <DocumentCard
                                          title="Jurídico e Fiscal"
                                          icon={Shield}
                                          color="from-emerald-500 to-teal-500"
                                        >
                                          <div className="space-y-4">
                                              <ToggleSwitch 
                                                label="Assinou Termo de Confidencialidade" 
                                                checked={formData.termoConfidencialidade} 
                                                onChange={c => handleCheckboxChange('termoConfidencialidade', c)} 
                                              />
                                              <Separator className="bg-white/5" />
                                              <ToggleSwitch 
                                                label="Apresentou Cartão CNPJ" 
                                                checked={formData.apresentouCartaoCnpj} 
                                                onChange={c => handleCheckboxChange('apresentouCartaoCnpj', c)} 
                                              />
                                              <div className="pt-2">
                                                  <ModernInput 
                                                    label="Número do CNPJ" 
                                                    value={formData.numeroCnpj || ''} 
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroCnpj', e.target.value)} 
                                                    placeholder="00.000.000/0000-00" 
                                                    icon={CreditCard}
                                                  />
                                              </div>
                                          </div>
                                        </DocumentCard>
                                      </motion.div>

                                      <motion.div variants={staggerItem}>
                                        <DocumentCard
                                          title="Conselho de Classe"
                                          icon={Award}
                                          color="from-blue-500 to-indigo-500"
                                        >
                                          <div className="space-y-4">
                                              <ModernInput 
                                                label="Conselho (CREA/CAU)" 
                                                value={formData.conselhoClasse || ''} 
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('conselhoClasse', e.target.value)} 
                                                icon={Building2}
                                                placeholder="CREA ou CAU"
                                              />
                                              <div className="grid grid-cols-2 gap-3">
                                                  <ModernInput 
                                                    label="Nº Registro" 
                                                    value={formData.numeroRegistroConselho || ''} 
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('numeroRegistroConselho', e.target.value)} 
                                                    icon={Hash}
                                                  />
                                                  <ModernInput 
                                                    label="Ano Registro" 
                                                    type="number" 
                                                    value={formData.anoRegistroConselho || ''} 
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('anoRegistroConselho', parseInt(e.target.value) || undefined)} 
                                                    icon={Calendar}
                                                  />
                                              </div>
                                              <Separator className="bg-white/5" />
                                              <ToggleSwitch 
                                                label="Certidão Quitação PF" 
                                                checked={formData.certidaoQuitacaoPf} 
                                                onChange={c => handleCheckboxChange('certidaoQuitacaoPf', c)} 
                                              />
                                              <ToggleSwitch 
                                                label="Certidão Quitação PJ" 
                                                checked={formData.certidaoQuitacaoPj} 
                                                onChange={c => handleCheckboxChange('certidaoQuitacaoPj', c)} 
                                              />
                                              
                                              {/* Detalhes da Certidão */}
                                              {(formData.certidaoQuitacaoPf || formData.certidaoQuitacaoPj) && (
                                                <motion.div 
                                                  initial={{ opacity: 0, height: 0 }} 
                                                  animate={{ opacity: 1, height: 'auto' }} 
                                                  className="pt-2 overflow-hidden"
                                                >
                                                    <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-xl border border-white/5 bg-blue-900/10 border-blue-500/10">
                                                        <div className="col-span-2 mb-1">
                                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                                                                <FileText className="w-3 h-3" />
                                                                Detalhes da Certidão (CRQ/CAU/CFT)
                                                            </Label>
                                                        </div>
                                                        <ModernInput 
                                                            label="Data de Emissão"
                                                            type="date"
                                                            value={formData.certidaoQuitacaoData || ''}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('certidaoQuitacaoData', e.target.value)}
                                                            icon={Calendar}
                                                        />
                                                        <div className="group space-y-2">
                                                            <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider flex items-center gap-2">
                                                              <Check className="w-3 h-3" />
                                                              Status
                                                            </Label>
                                                            <Select value={formData.certidaoQuitacaoStatus} onValueChange={(v) => handleChange('certidaoQuitacaoStatus', v)}>
                                                                <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 shadow-sm">
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-background border border-white/10 rounded-xl shadow-xl backdrop-blur-xl">
                                                                    <SelectItem value="vigente" className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5">
                                                                      <span className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"/> Vigente
                                                                      </span>
                                                                    </SelectItem>
                                                                    <SelectItem value="vencido" className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5">
                                                                      <span className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"/> Vencido
                                                                      </span>
                                                                    </SelectItem>
                                                                    <SelectItem value="na" className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5">N/A</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                              )}
                                          </div>
                                        </DocumentCard>
                                      </motion.div>
                                  </motion.div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>

                  {/* Footer fixed at bottom right of content area */}
                  <div className="p-4 md:p-6 border-t border-white/5 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Sparkles className="w-3 h-3 text-primary" />
                        </div>
                        <span>Preencha todos os campos obrigatórios</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => onOpenChange(false)} 
                          className="hover:bg-white/5 px-5"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white min-w-[160px] shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02]"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {person ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                        </Button>
                      </div>
                  </div>
              </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Confirmation Dialog for Unsaved Changes */}
    <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
      <AlertDialogContent className="bg-background border border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem alterações não salvas. Tem certeza que deseja sair? Suas alterações serão perdidas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 hover:bg-white/5">
            Continuar Editando
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmExit}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Descartar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <ContractFormDialog 
        open={contractDialogOpen}
        onOpenChange={setContractDialogOpen}
        onSave={handleSaveContract}
        contractToEdit={contractToEdit}
        type={contractTypeToAdd}
    />
    </>
  );
}

// --- Modern Components ---

function SectionHeader({title, description, icon: Icon, color}: {title: string, description: string, icon: any, color: string}) {
    return (
        <div className="flex items-start gap-4">
            <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>
        </div>
    )
}

function ModernInput({ label, id, className, icon: Icon, ...props }: any) {
    return (
        <div className={cn("group space-y-2", className)}>
            <Label htmlFor={id} className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider flex items-center gap-2">
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </Label>
            <div className="relative">
                <Input 
                    id={id} 
                    className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 text-sm placeholder:text-muted-foreground/40 shadow-sm pl-4" 
                    {...props} 
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-focus-within:from-primary/5 group-focus-within:via-transparent group-focus-within:to-primary/5 pointer-events-none transition-all duration-300" />
            </div>
        </div>
    );
}

function ModernSelect({ label, value, onChange, options, icon: Icon }: { label: string, value: any, onChange: (v: string) => void, options: string[], icon?: any }) {
    return (
        <div className="group space-y-2">
             <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider flex items-center gap-2">
               {Icon && <Icon className="w-3 h-3" />}
               {label}
             </Label>
             <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 shadow-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-white/10 rounded-xl shadow-xl backdrop-blur-xl">
                    {options.map(opt => (
                      <SelectItem 
                        key={opt} 
                        value={opt} 
                        className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5"
                      >
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function ModernChip({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <motion.button 
            type="button" 
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "h-9 px-4 rounded-full text-xs font-medium border transition-all duration-300 select-none flex items-center gap-2",
                selected 
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white border-primary/50 shadow-lg shadow-primary/25" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"
            )}
        >
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              ) : (
                <motion.div
                  key="circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3.5 h-3.5 rounded-full border-2 border-current opacity-40"
                />
              )}
            </AnimatePresence>
            {label}
        </motion.button>
    )
}

function DisciplineCard({ title, items, selectedItems, onToggle, color }: { 
  title: string, 
  items: string[], 
  selectedItems: string[], 
  onToggle: (item: string, checked: boolean) => void,
  color: string 
}) {
    return (
        <div className="rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden h-[320px] flex flex-col">
            <div className={cn("px-4 py-3 bg-gradient-to-r border-b border-white/5", color, "bg-opacity-20")}>
              <Label className="text-sm font-semibold text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                {title}
              </Label>
              <p className="text-[10px] text-white/60 mt-0.5">{selectedItems.length} selecionado(s)</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {items.map(d => (
                    <NavikeItem 
                        key={d} 
                        label={d} 
                        checked={selectedItems.includes(d)} 
                        onChange={(c) => onToggle(d, c)} 
                    />
                ))}
            </div>
        </div>
    )
}

function DocumentCard({ title, icon: Icon, color, children }: { title: string, icon: any, color: string, children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg", color)}>
                    <Icon className="w-4 h-4 text-white"/>
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
              </div>
            </div>
            <div className="p-5">
              {children}
            </div>
        </div>
    )
}

function NavikeItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <motion.div 
            onClick={() => onChange(!checked)}
            whileHover={{ x: 4 }}
            className={cn(
                "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all group",
                 checked ? "bg-primary/15 border border-primary/30" : "hover:bg-white/5 border border-transparent"
            )}
        >
            <span className={cn("text-xs transition-colors", checked ? "font-medium text-primary" : "text-muted-foreground group-hover:text-foreground")}>{label}</span>
            <AnimatePresence mode="wait">
              {checked && (
                <motion.div 
                  initial={{scale: 0, opacity: 0}} 
                  animate={{scale: 1, opacity: 1}}
                  exit={{scale: 0, opacity: 0}}
                  className="p-0.5 rounded-full bg-primary"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
    )
}

function ToggleSwitch({ label, checked, onChange }: { label: string, checked?: boolean, onChange: (c: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-1.5 group">
            <Label 
              className="cursor-pointer font-normal text-sm text-foreground/80 group-hover:text-foreground transition-colors" 
              onClick={() => onChange(!checked)}
            >
              {label}
            </Label>
            <motion.div 
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 border",
                    checked 
                      ? "bg-gradient-to-r from-primary to-primary/80 border-primary/50 shadow-lg shadow-primary/25" 
                      : "bg-white/10 hover:bg-white/15 border-white/10"
                )}
            >
                <motion.div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                  animate={{ 
                    left: checked ? 'calc(100% - 20px)' : '4px'
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </motion.div>
        </div>
    )
}

function TrainingAddForm({ 
  treinamentosList, 
  onAdd 
}: { 
  treinamentosList: string[], 
  onAdd: (treinamento: string, data: string) => void 
}) {
  const [selectedTreinamento, setSelectedTreinamento] = useState('');
  const [dataTreinamento, setDataTreinamento] = useState('');

  const handleAdd = () => {
    if (selectedTreinamento) {
      onAdd(selectedTreinamento, dataTreinamento);
      setSelectedTreinamento('');
      setDataTreinamento('');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Plus className="w-4 h-4 text-primary" />
        Adicionar Treinamento
      </div>
      
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Treinamento
          </Label>
          <Select value={selectedTreinamento} onValueChange={setSelectedTreinamento}>
            <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 shadow-sm">
              <SelectValue placeholder="Selecione o treinamento" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-white/10 rounded-xl shadow-xl backdrop-blur-xl">
              {treinamentosList.map(t => (
                <SelectItem 
                  key={t} 
                  value={t} 
                  className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-12 md:col-span-4">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Data de Realização
          </Label>
          <Input
            type="date"
            value={dataTreinamento}
            onChange={(e) => setDataTreinamento(e.target.value)}
            className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 text-sm shadow-sm"
          />
        </div>
        
        <div className="col-span-12 md:col-span-2 flex items-end">
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!selectedTreinamento}
            className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Status options mapping - valores como estão no banco de dados
const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'banco de dados', label: 'Banco de Dados' },
  { value: 'baixa frequencia', label: 'Baixa Frequência' },
];

function StatusSelect({ 
  label, 
  value, 
  onChange 
}: { 
  label: string, 
  value: string | undefined, 
  onChange: (v: string) => void 
}) {
  const selectedOption = statusOptions.find(opt => opt.value === value);
  
  return (
    <div className="group space-y-2">
      <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors ml-0.5 uppercase tracking-wider flex items-center gap-2">
        <Award className="w-3 h-3" />
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 transition-all focus:ring-0 focus:border-primary/50 shadow-sm">
          <SelectValue placeholder="Selecione o status">
            {selectedOption?.label || 'Selecione'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background border border-white/10 rounded-xl shadow-xl backdrop-blur-xl">
          {statusOptions.map(opt => (
            <SelectItem 
              key={opt.value} 
              value={opt.value} 
              className="focus:bg-primary/10 cursor-pointer rounded-lg mx-1 my-0.5"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
