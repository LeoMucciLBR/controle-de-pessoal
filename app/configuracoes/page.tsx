"use client";

import { useState } from 'react';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { GenericList } from '@/components/settings/GenericList';
import { useSettings, SettingsCategory } from '@/contexts/SettingsContext';

export default function SettingsPage() {
    const [activeCategory, setActiveCategory] = useState<SettingsCategory>('empresas');
    const { 
        empresas, 
        contratos, 
        disciplinasProjeto, 
        disciplinasObra, 
        areas, 
        treinamentos,
        addItem, 
        removeItem 
    } = useSettings();

    const renderContent = () => {
        switch (activeCategory) {
            case 'empresas':
                return (
                    <GenericList 
                        title="Empresas" 
                        description="Gerencie as empresas parceiras e fornecedores." 
                        items={empresas}
                        onAdd={(item) => addItem('empresas', item)}
                        onDelete={(item) => removeItem('empresas', item)}
                    />
                );
            case 'contratos':
                return (
                    <GenericList 
                        title="Contratos" 
                        description="Gerencie os contratos ativos no sistema." 
                        items={contratos}
                        onAdd={(item) => addItem('contratos', item)}
                        onDelete={(item) => removeItem('contratos', item)}
                    />
                );
            case 'disciplinasProjeto':
                return (
                    <GenericList 
                        title="Disciplinas de Projeto" 
                        description="Especialidades técnicas para projetos de engenharia." 
                        items={disciplinasProjeto}
                        onAdd={(item) => addItem('disciplinasProjeto', item)}
                        onDelete={(item) => removeItem('disciplinasProjeto', item)}
                    />
                );
            case 'disciplinasObra':
                return (
                    <GenericList 
                        title="Disciplinas de Obra" 
                        description="Especialidades e funções para execução de obras." 
                        items={disciplinasObra}
                        onAdd={(item) => addItem('disciplinasObra', item)}
                        onDelete={(item) => removeItem('disciplinasObra', item)}
                    />
                );
            case 'areas':
                return (
                    <GenericList 
                        title="Áreas de Atuação" 
                        description="Setores de atuação (Rodovia, Ferrovia, etc)." 
                        items={areas}
                        type="object"
                        onAdd={(item) => addItem('areas', item)}
                        onDelete={(item) => removeItem('areas', item)}
                    />
                );
            case 'treinamentos':
                return (
                    <GenericList 
                        title="Treinamentos" 
                        description="Certificações, cursos e treinamentos obrigatórios." 
                        items={treinamentos}
                        onAdd={(item) => addItem('treinamentos', item)}
                        onDelete={(item) => removeItem('treinamentos', item)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-0">
            <SettingsSidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <div className="flex-1 pl-0">
                {renderContent()}
            </div>
        </div>
    );
}
