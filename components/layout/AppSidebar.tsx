"use client"

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from './SidebarContext';

const navItems = [
  { to: '/dashboard', icon: Users, label: 'Pessoas' },
  { to: '/ordens-servico', icon: FileText, label: 'Ordens de Serviço' },
  { to: '/empresas', icon: Building2, label: 'Empresas' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function AppSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  // Auto-collapse on mobile/tablet resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false); 
      }
    };
    
    // Initial check
    if (window.innerWidth < 1024) {
        setCollapsed(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header / Logo */}
      <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2f4982] to-[#4b6cb7] shadow-glow">
              <span className="text-white text-xs">LBR</span>
            </div>
            <span>Controle</span>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-muted-foreground hover:text-white hover:bg-muted hidden lg:flex", collapsed && "w-full")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
          const Icon = item.icon;

          return (
            <Link key={item.to} href={item.to} className="relative block group">
               {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/20 border-l-4 border-primary rounded-r-md"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div
                className={cn(
                  "relative flex items-center px-3 py-3 rounded-md transition-all duration-200 group-hover:text-white",
                  isActive ? "text-white font-medium" : "text-muted-foreground",
                  collapsed ? "justify-center" : "gap-3"
                )}
              >
                <Icon size={20} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / User */}
      <div className="p-4 border-t border-border">
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
            <Avatar className="h-9 w-9 border border-border/50">
               <AvatarImage src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" />
               <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            
            {!collapsed && (
               <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@lbr.com</p>
               </div>
            )}
            
             {!collapsed && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                  <LogOut size={16} />
                </Button>
             )}
          </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="secondary" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="shadow-lg">
             <Menu />
          </Button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen flex-col bg-[#0f111a] border-r border-border shadow-2xl"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/90"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-[#0f111a] border-r border-border"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
