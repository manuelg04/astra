'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AuthCard } from '../customComponents/auth-card';

type Mode = 'initial' | 'login' | 'register';

export default function AuthUnified() {
  const [mode, setMode]     = useState<Mode>('initial');
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');
  const [confirm, setConf]  = useState('');
  const router = useRouter();

  /* Paso 1 – chequear correo */
  const checkEmail = async () => {
    if (!email) return toast.error('Ingresa tu correo.');

    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const { error } = await res.json();
      return toast.error(error ?? 'Error interno.');
    }

    const { exists } = await res.json();
    setMode(exists ? 'login' : 'register');

    toast(
      exists
        ? 'Correo reconocido, ingresa tu contraseña.'
        : 'Nuevo correo: crea tu contraseña.',
    );
  };

  /* Paso 2 – login / registro */
  const handleSubmit = async () => {
    if (mode === 'login') {
      if (!password) return toast.error('Escribe la contraseña.');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error ?? 'Credenciales inválidas.');
      }

      toast.success('¡Bienvenido de nuevo!');
      router.push('/dashboard');
    }

    if (mode === 'register') {
      if (!password || !confirm)
        return toast.error('Completa ambos campos de contraseña.');

      if (password !== confirm)
        return toast.error('Las contraseñas no coinciden.');

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const { error } = await res.json();
        return toast.error(error ?? 'No se pudo crear la cuenta.');
      }

      toast.success('Cuenta creada, configura tu perfil.');
      router.push('/setup-profile');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard>
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <Sparkles className="h-8 w-8 text-[var(--astra-pill)]" />
          Astra
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="astra-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={mode !== 'initial'}
        />

        {mode !== 'initial' && (
          <>
            <input
              type="password"
              placeholder="Contraseña"
              className="astra-input"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
            {mode === 'register' && (
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="astra-input"
                value={confirm}
                onChange={(e) => setConf(e.target.value)}
              />
            )}
          </>
        )}

        {mode === 'initial' && (
          <button className="astra-btn" onClick={checkEmail}>
            Continuar
          </button>
        )}
        {mode === 'login' && (
          <button className="astra-btn" onClick={handleSubmit}>
            Ingresar
          </button>
        )}
        {mode === 'register' && (
          <button className="astra-btn" onClick={handleSubmit}>
            Crear cuenta
          </button>
        )}
      </AuthCard>
    </main>
  );
}