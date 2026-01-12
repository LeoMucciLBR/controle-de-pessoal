"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Person } from '@/types/person';

interface PeopleContextType {
    people: Person[];
    loading: boolean;
    error: string | null;
    
    // Actions
    addPerson: (person: Omit<Person, 'id'>) => Promise<Person>;
    updatePerson: (id: number, person: Partial<Person>) => Promise<Person>;
    deletePerson: (id: number) => Promise<void>;
    refreshPeople: () => Promise<void>;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({ children }: { children: ReactNode }) {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPeople = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/people');
            if (!response.ok) throw new Error('Erro ao buscar pessoas');
            
            const data = await response.json();
            setPeople(data);
        } catch (err) {
            console.error('Erro ao carregar pessoas:', err);
            setError('Erro ao carregar pessoas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    const addPerson = async (personData: Omit<Person, 'id'>): Promise<Person> => {
        try {
            const response = await fetch('/api/people', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao criar pessoa');
            }

            const newPerson = await response.json();
            setPeople(prev => [...prev, newPerson]);
            return newPerson;
        } catch (err) {
            console.error('Erro ao adicionar pessoa:', err);
            throw err;
        }
    };

    const updatePerson = async (id: number, personData: Partial<Person>): Promise<Person> => {
        try {
            const response = await fetch(`/api/people/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao atualizar pessoa');
            }

            const updatedPerson = await response.json();
            setPeople(prev => prev.map(p => p.id === id ? updatedPerson : p));
            return updatedPerson;
        } catch (err) {
            console.error('Erro ao atualizar pessoa:', err);
            throw err;
        }
    };

    const deletePerson = async (id: number): Promise<void> => {
        try {
            const response = await fetch(`/api/people/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao deletar pessoa');
            }

            setPeople(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Erro ao deletar pessoa:', err);
            throw err;
        }
    };

    return (
        <PeopleContext.Provider value={{
            people,
            loading,
            error,
            addPerson,
            updatePerson,
            deletePerson,
            refreshPeople: fetchPeople
        }}>
            {children}
        </PeopleContext.Provider>
    );
}

export function usePeople() {
    const context = useContext(PeopleContext);
    if (context === undefined) {
        throw new Error('usePeople must be used within a PeopleProvider');
    }
    return context;
}
