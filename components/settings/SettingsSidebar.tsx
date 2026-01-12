"use client";

import { cn } from "@/lib/utils";
import { Building2, FileText, User, BookOpen, GraduationCap, LayoutGrid, Settings2, ChevronRight, ArrowLeft, Home } from "lucide-react";
import { SettingsCategory } from "@/contexts/SettingsContext";
import Link from "next/link";

interface SettingsSidebarProps {
    activeCategory: SettingsCategory;
    onSelectCategory: (category: SettingsCategory) => void;
}

const sidebarItems = [
    { id: 'empresas', label: 'Empresas', icon: Building2, description: 'Parceiros e fornecedores' },
    { id: 'contratos', label: 'Contratos', icon: FileText, description: 'Gestão contratual' },
    { id: 'disciplinasProjeto', label: 'Disc. Projeto', icon: LayoutGrid, description: 'Especialidades técnicas' },
    { id: 'disciplinasObra', label: 'Disc. Obra', icon: User, description: 'Equipes de campo' },
    { id: 'areas', label: 'Áreas de Atuação', icon: BookOpen, description: 'Setores de operação' },
    { id: 'treinamentos', label: 'Treinamentos', icon: GraduationCap, description: 'Cursos e certificados' },
] as const;

export function SettingsSidebar({ activeCategory, onSelectCategory }: SettingsSidebarProps) {
    return (
        <div className="w-72 flex-shrink-0 border-r border-white/5 bg-[#09090b] flex flex-col h-full overflow-hidden relative">
            {/* Background ambiance */}
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none" />

            <div className="p-8 pb-4 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                        <Settings2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Configurações
                        </h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Sistema Ativo</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
            </div>
            
            <nav className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                {sidebarItems.map((item) => {
                    const isActive = activeCategory === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectCategory(item.id as SettingsCategory)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden",
                                isActive 
                                    ? "bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30" 
                                    : "hover:bg-white/5 border border-transparent hover:border-white/5"
                            )}
                        >
                            {/* Active Left Border */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                            )}

                            <div className={cn(
                                "p-2 rounded-lg transition-all duration-300 relative z-10",
                                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground group-hover:text-foreground group-hover:bg-white/10"
                            )}>
                                <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 relative z-10">
                                <div className={cn(
                                    "text-sm font-semibold tracking-tight transition-colors duration-200",
                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                )}>
                                    {item.label}
                                </div>
                                <div className={cn(
                                    "text-[10px] sm:text-[11px] mt-0.5 font-medium transition-colors duration-200",
                                    isActive ? "text-primary/80" : "text-zinc-600 group-hover:text-zinc-500"
                                )}>
                                    {item.description}
                                </div>
                            </div>
                            
                            <ChevronRight className={cn(
                                "w-4 h-4 relative z-10 transition-all duration-200",
                                isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-50"
                            )} />
                        </button>
                    )
                })}
            </nav>

            {/* Back to Dashboard Card */}
            <div className="p-4 border-t border-white/5">
                <Link href="/dashboard">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 hover:from-primary/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:translate-x-1">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground group-hover:text-white transition-colors">
                                Voltar ao Dashboard
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                Gestão de Pessoas
                            </div>
                        </div>
                        <Home className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
