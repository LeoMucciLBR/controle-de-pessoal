"use client";

import { ReactNode } from 'react';
import { AppTopbar } from './AppTopbar';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

function PageHeader() {
    const pathname = usePathname();
    const getPageTitle = (path: string) => {
        if (path === '/dashboard') return 'Gestão de Pessoas';
        if (path.includes('/ordens-servico')) return 'Ordens de Serviço';
        if (path.includes('/empresas')) return 'Empresas';
        if (path.includes('/configuracoes')) return 'Configurações';
        return 'Controle de Pessoal';
    };

    return (
        <div className="mb-6">
             <h1 className="text-2xl font-bold tracking-tight text-white">{getPageTitle(pathname)}</h1>
        </div>
    );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f172a' }}>
       <AppTopbar />
       <main className="flex-1 p-6 animate-fade-in w-full max-w-[1920px] mx-auto">
           <PageHeader />
           {children}
       </main>
       <Toaster />
    </div>
  );
}
