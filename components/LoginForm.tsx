'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const result = await login(email, password);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    },
    unfocused: {
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md flex flex-col items-center"
    >
      {/* Logo acima do card */}
      <motion.div
        className="flex justify-center mb-8 relative w-28 h-28"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Image
          src="/logo.png"
          alt="Logo Controle de Pessoal"
          fill
          className="object-contain drop-shadow-lg"
        />
      </motion.div>

      <motion.div
        className="glass-card rounded-2xl p-8 md:p-10 w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2">
            Controle de Pessoal
          </h1>
          <p className="text-muted-foreground text-sm">
            Acesse sua conta para continuar
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <motion.div
            className="space-y-2"
            variants={inputVariants}
            animate={focusedField === 'username' ? 'focused' : 'unfocused'}
          >
            <Label htmlFor="username" className="text-foreground font-medium">
              Usuário
            </Label>
            <div className={`relative input-glow rounded-lg transition-all duration-300 ${focusedField === 'username' ? 'ring-2 ring-primary/20' : ''}`}>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="seu.usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className="pl-10 h-12 bg-background border-border focus:border-primary transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            className="space-y-2"
            variants={inputVariants}
            animate={focusedField === 'password' ? 'focused' : 'unfocused'}
          >
            <Label htmlFor="password" className="text-foreground font-medium">
              Senha
            </Label>
            <div className={`relative input-glow rounded-lg transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-primary/20' : ''}`}>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="pl-10 pr-10 h-12 bg-background border-border focus:border-primary transition-all duration-300"
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                whileTap={{ scale: 0.9 }}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold gradient-bg hover:opacity-90 transition-all duration-300 group glow"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <ArrowRight className="w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          className="mt-8 pt-6 border-t border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            Sistema interno de gestão de competências
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
