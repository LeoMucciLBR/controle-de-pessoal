"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    empresas as initialEmpresas, 
    contratos as initialContratos, 
    areasAtuacao as initialAreas,
    disciplinasProjetoList as initialDisciplinasProjeto,
    disciplinasObraList as initialDisciplinasObra
} from '@/lib/mock-data';

// Define the shape of our settings context
interface SettingsContextType {
    empresas: string[];
    contratos: string[];
    disciplinasProjeto: string[];
    disciplinasObra: string[];
    // Areas are objects in mock-data, but for simplicity in "generic list" we might want to handle them carefully.
    // For now, let's keep them as a mapped list of strings or objects. 
    // The requirement implies adding new "Areas". 
    // Let's stick to the structure from mock-data but make it mutable.
    areas: { value: string; label: string }[];
    
    // New field
    treinamentos: string[];

    // Actions
    addItem: (category: SettingsCategory, item: string) => void;
    removeItem: (category: SettingsCategory, item: string) => void;
}

export type SettingsCategory = 
    | 'empresas' 
    | 'contratos' 
    | 'disciplinasProjeto' 
    | 'disciplinasObra' 
    | 'areas' 
    | 'treinamentos';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const initialTreinamentos = [
    "NR-10", "NR-35", "BIM Management", "Gestão de Projetos", "Liderança", "Scrum Master"
];

export function SettingsProvider({ children }: { children: ReactNode }) {
    // Initialize state with mock data
    // In a real app, this would come from an API
    const [empresas, setEmpresas] = useState<string[]>(initialEmpresas);
    const [contratos, setContratos] = useState<string[]>(initialContratos);
    const [disciplinasProjeto, setDisciplinasProjeto] = useState<string[]>(initialDisciplinasProjeto);
    const [disciplinasObra, setDisciplinasObra] = useState<string[]>(initialDisciplinasObra);
    const [areas, setAreas] = useState<{ value: string; label: string }[]>(initialAreas);
    const [treinamentos, setTreinamentos] = useState<string[]>(initialTreinamentos);

    const addItem = (category: SettingsCategory, item: string) => {
        switch (category) {
            case 'empresas':
                if (!empresas.includes(item)) setEmpresas([...empresas, item]);
                break;
            case 'contratos':
                if (!contratos.includes(item)) setContratos([...contratos, item]);
                break;
            case 'disciplinasProjeto':
                if (!disciplinasProjeto.includes(item)) setDisciplinasProjeto([...disciplinasProjeto, item]);
                break;
            case 'disciplinasObra':
                if (!disciplinasObra.includes(item)) setDisciplinasObra([...disciplinasObra, item]);
                break;
            case 'treinamentos':
                if (!treinamentos.includes(item)) setTreinamentos([...treinamentos, item]);
                break;
            case 'areas':
                // For areas, we need to generate a value from the label
                const value = item.toLowerCase().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (!areas.some(a => a.value === value)) {
                    setAreas([...areas, { value, label: item }]);
                }
                break;
        }
    };

    const removeItem = (category: SettingsCategory, item: string) => {
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
                // For areas, item is the value or label? Let's assume passed item is the value for deletion for safety, 
                // OR we handle deletion by finding the match. Let's assume we pass the *Label* or *Value*.
                // For "Generic List", users usually delete by seeing the Label.
                // Let's filter by label match for simplicity in this MVP context
                setAreas(prev => prev.filter(a => a.label !== item));
                break;
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
            addItem,
            removeItem
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
