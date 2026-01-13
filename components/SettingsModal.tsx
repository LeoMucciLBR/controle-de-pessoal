"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  FileText, 
  LayoutGrid, 
  GraduationCap,
  MapPin,
  Plus, 
  Trash2,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useSettings, SettingsCategory } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryConfig {
  id: SettingsCategory;
  label: string;
  icon: any;
  description: string;
}

const categories: CategoryConfig[] = [
  { 
    id: 'empresas', 
    label: 'Empresas', 
    icon: Building2, 
    description: 'Empresas disponíveis para vínculo'
  },
  { 
    id: 'contratos', 
    label: 'Contratos', 
    icon: FileText, 
    description: 'Contratos ativos no sistema'
  },
  { 
    id: 'clientes', 
    label: 'Clientes', 
    icon: Building2, 
    description: 'Clientes para ordens de serviço'
  },
  { 
    id: 'disciplinasProjeto', 
    label: 'Disciplinas de Projeto', 
    icon: LayoutGrid, 
    description: 'Áreas de atuação em projetos'
  },
  { 
    id: 'disciplinasObra', 
    label: 'Disciplinas de Obra', 
    icon: LayoutGrid, 
    description: 'Áreas de atuação em obras'
  },
  { 
    id: 'areas', 
    label: 'Áreas de Atuação', 
    icon: MapPin, 
    description: 'Regiões de atuação'
  },
  { 
    id: 'treinamentos', 
    label: 'Treinamentos', 
    icon: GraduationCap, 
    description: 'Certificações e cursos'
  },
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { 
    empresas, 
    contratos,
    clientes, 
    disciplinasProjeto, 
    disciplinasObra, 
    areas, 
    treinamentos,
    addItem,
    removeItem 
  } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsCategory>('empresas');
  const [newItem, setNewItem] = useState('');

  const getItems = (category: SettingsCategory): string[] => {
    switch (category) {
      case 'empresas': return empresas;
      case 'contratos': return contratos;
      case 'clientes': return clientes;
      case 'disciplinasProjeto': return disciplinasProjeto;
      case 'disciplinasObra': return disciplinasObra;
      case 'areas': return areas.map(a => a.label);
      case 'treinamentos': return treinamentos;
      default: return [];
    }
  };

  const handleAdd = () => {
    const value = newItem.trim();
    if (value) {
      addItem(activeTab, value);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const activeCategory = categories.find(c => c.id === activeTab);
  const items = getItems(activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[600px] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-none flex flex-col md:flex-row items-stretch">
        <DialogTitle className="sr-only">
          Configurações do Sistema
        </DialogTitle>
        <DialogDescription className="sr-only">
          Gerencie as opções dos dropdowns que aparecem no cadastro de pessoas.
        </DialogDescription>
        
        {/* Glass Container */}
        <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-xl bg-gradient-to-b from-background/95 to-background shadow-2xl shadow-black/50">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.02] flex flex-col min-h-[120px] md:min-h-[500px]">
            
            {/* Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Configurações</h2>
                  <p className="text-xs text-muted-foreground">Opções do sistema</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
              {categories.map((category) => {
                const isActive = activeTab === category.id;
                const Icon = category.icon;
                const count = getItems(category.id).length;
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(category.id);
                      setNewItem('');
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                      isActive 
                        ? "bg-primary/10 text-foreground" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                    <span className="flex-1 text-sm font-medium truncate">{category.label}</span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                    )}>
                      {count}
                    </span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      isActive && "text-primary"
                    )} />
                  </button>
                );
              })}
            </nav>

            {/* Footer hint */}
            <div className="p-4 border-t border-white/5 hidden md:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Alterações refletem no cadastro</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col bg-background min-h-[350px] md:min-h-[500px]">
            
            {/* Content Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                {activeCategory && (
                  <>
                    <activeCategory.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{activeCategory.label}</h3>
                      <p className="text-xs text-muted-foreground">{activeCategory.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add New Item */}
            <div className="p-5 border-b border-white/5">
              <div className="flex gap-3">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Adicionar novo item...`}
                  className="h-10 bg-white/5 border-white/10 focus:border-primary/50 rounded-lg"
                />
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newItem.trim()}
                  className="h-10 px-4 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="p-4 rounded-full bg-white/5 mb-4">
                      {activeCategory && <activeCategory.icon className="w-8 h-8 text-muted-foreground/50" />}
                    </div>
                    <p className="text-sm text-muted-foreground">Nenhum item cadastrado</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Adicione um novo item acima</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.02 }}
                        className="group flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
                      >
                        <span className="text-sm text-foreground">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(activeTab, item)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex justify-end">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="hover:bg-white/5"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
