'use client';

import AnimatedBackground from '@/components/AnimatedBackground';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden bg-background">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Login form - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <LoginForm />
      </div>
    </div>
  );
}
