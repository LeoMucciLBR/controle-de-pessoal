"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, AlertCircle, Sparkles, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GenericListProps {
    title: string;
    description: string;
    items: string[] | { value: string; label: string }[];
    onAdd: (item: string) => void;
    onDelete: (item: string) => void;
    type?: 'string' | 'object';
}

export function GenericList({ title, description, items, onAdd, onDelete, type = 'string' }: GenericListProps) {
    const [newItem, setNewItem] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAdd = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!newItem.trim()) return;
        
        const exists = items.some(i => 
            type === 'string' 
                ? (i as string).toLowerCase() === newItem.trim().toLowerCase() 
                : (i as { label: string }).label.toLowerCase() === newItem.trim().toLowerCase()
        );

        if (exists) {
            toast.error("Este item já existe na lista.");
            return;
        }

        onAdd(newItem.trim());
        setNewItem('');
        setIsAdding(false);
        toast.success("Item adicionado com sucesso!");
    };

    const confirmDelete = (text: string) => {
        onDelete(text);
        setDeletingId(null);
        toast.success("Item removido.");
    }

    const filteredItems = items.filter(i => {
        const text = type === 'string' ? (i as string) : (i as { label: string }).label;
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            {/* Header Area */}
            <div className="p-6 md:p-8 pb-4 relative z-10">
                {/* Title Section */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-xs font-medium text-primary mb-4">
                        <Sparkles className="w-3 h-3" />
                        <span>Gestão de Registros</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-lg text-sm">
                        {description}
                    </p>
                </div>

                {/* Action Bar - Search + Add */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Section */}
                    <div className="flex-1">
                        <div className={cn(
                            "relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden",
                            isSearchFocused 
                                ? "bg-white/[0.08] border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/20" 
                                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                        )}>
                            <div className={cn(
                                "flex items-center justify-center w-12 h-12 transition-colors duration-300",
                                isSearchFocused ? "text-primary" : "text-muted-foreground"
                            )}>
                                <Search className="w-5 h-5" />
                            </div>
                            <Input 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder={`Buscar em ${title.toLowerCase()}...`} 
                                className="flex-1 h-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 text-sm px-0"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="flex items-center justify-center w-10 h-10 mr-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <div className="flex items-center gap-2 pr-3 text-[10px] text-muted-foreground/60 font-mono uppercase">
                                <span className="hidden sm:inline">{filteredItems.length} itens</span>
                            </div>
                        </div>
                    </div>

                    {/* Add New Item Section */}
                    <div className="lg:w-[400px]">
                        <form onSubmit={handleAdd}>
                            <div className={cn(
                                "relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden",
                                isAdding 
                                    ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/40 shadow-lg shadow-primary/15 ring-2 ring-primary/20" 
                                    : "bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/30 hover:from-emerald-500/10"
                            )}>
                                <div className={cn(
                                    "flex items-center justify-center w-12 h-12 transition-colors duration-300",
                                    isAdding ? "text-primary" : "text-emerald-500"
                                )}>
                                    <Plus className="w-5 h-5" />
                                </div>
                                <Input 
                                    ref={inputRef}
                                    value={newItem} 
                                    onChange={(e) => {
                                        setNewItem(e.target.value);
                                        if (e.target.value) setIsAdding(true);
                                    }} 
                                    onFocus={() => setIsAdding(true)}
                                    onBlur={() => !newItem && setIsAdding(false)}
                                    placeholder="Adicionar novo item..." 
                                    className="flex-1 h-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 text-sm px-0"
                                />
                                {newItem.trim() ? (
                                    <div className="pr-2">
                                        <Button 
                                            type="submit" 
                                            size="sm"
                                            className="h-9 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                        >
                                            <Plus className="w-4 h-4 mr-1.5" />
                                            Adicionar
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="pr-4 text-[10px] text-emerald-500/70 font-medium uppercase tracking-wider hidden sm:block">
                                        Novo
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar relative z-10">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-dashed border-white/10">
                        <div className="p-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent mb-4">
                            <AlertCircle className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="font-medium text-foreground/70">Nenhum item encontrado</p>
                        <p className="text-sm opacity-50 mt-1 text-center max-w-xs">
                            {searchTerm ? 'Tente ajustar sua busca ou adicione um novo item' : 'Adicione seu primeiro item usando o campo acima'}
                        </p>
                        {!searchTerm && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                                onClick={() => inputRef.current?.focus()}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar primeiro item
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredItems.map((item) => {
                            const text = type === 'string' ? (item as string) : (item as { label: string }).label;
                            const id = type === 'string' ? (item as string) : (item as { value: string }).value;
                            const isDeleting = deletingId === id;
                            
                            return (
                                <div
                                    key={id}
                                    className={cn(
                                        "group relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-default",
                                        isDeleting 
                                            ? "bg-gradient-to-r from-destructive/10 to-transparent border-destructive/30" 
                                            : "bg-gradient-to-r from-white/[0.04] to-transparent border-white/10 hover:border-primary/30 hover:from-white/[0.06] hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                    )}
                                >
                                    {/* Indicator dot */}
                                    <div className={cn(
                                        "w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300",
                                        isDeleting ? "bg-destructive" : "bg-primary"
                                    )} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-medium text-sm truncate transition-colors duration-300",
                                            isDeleting ? "text-destructive" : "text-foreground/90 group-hover:text-foreground"
                                        )}>
                                            {text}
                                        </h3>
                                    </div>

                                    {/* Actions */}
                                    {isDeleting ? (
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={() => confirmDelete(type === 'string' ? text : id)}
                                                className="h-8 w-8 rounded-lg text-destructive hover:text-white hover:bg-destructive transition-all duration-200"
                                                title="Confirmar exclusão"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={() => setDeletingId(null)}
                                                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200"
                                                title="Cancelar"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setDeletingId(id)}
                                            className="h-8 w-8 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
