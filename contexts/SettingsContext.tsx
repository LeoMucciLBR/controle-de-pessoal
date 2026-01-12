"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the shape of our settings context
interface SettingsContextType {
    empresas: string[];
    contratos: string[];
    disciplinasProjeto: string[];
    disciplinasObra: string[];
    areas: { value: string; label: string }[];
    treinamentos: string[];
    loading: boolean;
    
    // Actions
    addItem: (category: SettingsCategory, item: string) => Promise<void>;
    removeItem: (category: SettingsCategory, item: string) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

export type SettingsCategory = 
    | 'empresas' 
    | 'contratos' 
    | 'disciplinasProjeto' 
    | 'disciplinasObra' 
    | 'areas' 
    | 'treinamentos';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [empresas, setEmpresas] = useState<string[]>([]);
    const [contratos, setContratos] = useState<string[]>([]);
    const [disciplinasProjeto, setDisciplinasProjeto] = useState<string[]>([]);
    const [disciplinasObra, setDisciplinasObra] = useState<string[]>([]);
    const [areas, setAreas] = useState<{ value: string; label: string }[]>([]);
    const [treinamentos, setTreinamentos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Erro ao buscar configurações');
            
            const data = await response.json();
            
            setEmpresas(data.empresas?.map((e: any) => e.value || e) || []);
            setContratos(data.contratos?.map((c: any) => c.value || c) || []);
            setDisciplinasProjeto(data.disciplinasProjeto?.map((d: any) => d.value || d) || []);
            setDisciplinasObra(data.disciplinasObra?.map((d: any) => d.value || d) || []);
            setAreas(data.areas || []);
            setTreinamentos(data.treinamentos?.map((t: any) => t.value || t) || []);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const addItem = async (category: SettingsCategory, item: string) => {
        try {
            const body: any = { category, value: item };
            
            // Para áreas, geramos o value a partir do label
            if (category === 'areas') {
                const value = item.toLowerCase().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                body.value = value;
                body.label = item;
            }

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao adicionar item');
            }

            // Atualizar estado local
            switch (category) {
                case 'empresas':
                    setEmpresas(prev => [...prev, item]);
                    break;
                case 'contratos':
                    setContratos(prev => [...prev, item]);
                    break;
                case 'disciplinasProjeto':
                    setDisciplinasProjeto(prev => [...prev, item]);
                    break;
                case 'disciplinasObra':
                    setDisciplinasObra(prev => [...prev, item]);
                    break;
                case 'treinamentos':
                    setTreinamentos(prev => [...prev, item]);
                    break;
                case 'areas':
                    const value = item.toLowerCase().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    setAreas(prev => [...prev, { value, label: item }]);
                    break;
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            throw error;
        }
    };

    const removeItem = async (category: SettingsCategory, item: string) => {
        try {
            let valueToDelete = item;
            
            // Para áreas, precisamos encontrar o value correto
            if (category === 'areas') {
                const area = areas.find(a => a.label === item || a.value === item);
                valueToDelete = area?.value || item;
            }

            const response = await fetch(`/api/settings?category=${category}&value=${encodeURIComponent(valueToDelete)}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Erro ao remover item');

            // Atualizar estado local
            switch (category) {
                case 'empresas':
                    setEmpresas(prev => prev.filter(i => i !== item));
                    break;
                case 'contratos':
                    setContratos(prev => prev.filter(i => i !== item));
                    break;
                case 'disciplinasProjeto':
                    setDisciplinasProjeto(prev => prev.filter(i => i !== item));
                    break;
                case 'disciplinasObra':
                    setDisciplinasObra(prev => prev.filter(i => i !== item));
                    break;
                case 'treinamentos':
                    setTreinamentos(prev => prev.filter(i => i !== item));
                    break;
                case 'areas':
                    setAreas(prev => prev.filter(a => a.label !== item && a.value !== item));
                    break;
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
            throw error;
        }
    };

    return (
        <SettingsContext.Provider value={{
            empresas,
            contratos,
            disciplinasProjeto,
            disciplinasObra,
            areas,
            treinamentos,
            loading,
            addItem,
            removeItem,
            refreshSettings: fetchSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
