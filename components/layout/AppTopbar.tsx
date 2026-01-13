"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  Building2,
  Menu,
  X,
  LogOut,
  Settings,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SettingsModal } from '@/components/SettingsModal';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: Users, label: 'Pessoas' },
  { to: '/graficos', icon: PieChart, label: 'Indicadores' },
  { to: '/ordens-servico', icon: FileText, label: 'Ordens de Serviço' },
  { to: '/empresas', icon: Building2, label: 'Empresas' },
];


export function AppTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Evita erro de hydration esperando montagem no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Usa valores padrão até que o componente esteja montado para evitar hydration mismatch
  const userInitials = mounted && user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  const userName = mounted ? (user?.name || 'Usuário') : 'Usuário';
  const userEmail = mounted ? (user?.email || '') : '';

  const avatarUrl = mounted && user?.name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2f4982&color=fff`
    : 'https://ui-avatars.com/api/?name=User&background=2f4982&color=fff';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b shadow-sm" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2f4982] to-[#4b6cb7]">
                <span className="text-white text-xs font-bold">LBR</span>
              </div>
              <span>Controle</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "text-white bg-secondary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTopNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Configurações Button - Opens Modal */}
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings size={18} />
                <span>Configurações</span>
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="hidden lg:block h-6 w-px bg-border" />

            {/* User Profile Dropdown */}
            <div className="hidden lg:flex">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border hover:bg-muted">
                       <Avatar className="h-9 w-9">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                       </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56" forceMount>
                     <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                           <p className="font-medium">{userName}</p>
                           <p className="w-[200px] truncate text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                     </div>
                     <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-card"
            >
              <div className="space-y-1 px-4 py-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-secondary text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Configurações Button - Mobile */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full text-left"
                >
                  <Settings size={20} />
                  <span>Configurações</span>
                </button>
                
                <div className="border-t border-border my-2 pt-2">
                   <div className="flex items-center gap-3 px-3 py-3 rounded-md">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">{userEmail}</p>
                       </div>
                   </div>
                   <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-muted">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                   </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
      />
    </>
  );
}
