'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AuthCard } from '../customComponents/auth-card';
export default function SetupProfile() {
  const router = useRouter();
  const [name,  setName]  = useState('');
  const [phone, setPhone] = useState('');
  const [file,  setFile]  = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!name || !phone) {
      toast.error('Completa todos los campos.');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('phone', phone);
    if (file) form.append('image', file);

    const res = await fetch('/api/auth/setup-profile', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      toast.error('No se pudo guardar.');
      return;
    }

    toast.success('Perfil listo ✨');
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AuthCard>
        <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <UserPlus className="h-6 w-6 text-[var(--astra-pill)]" />
          Configura tu perfil
        </h1>

        <input
          placeholder="Nombre completo"
          className="astra-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Teléfono (ej. +57 3001234567)"
          className="astra-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="text-sm">Foto de perfil</label>
        <input
          type="file"
          accept="image/*"
          className="astra-input file:text-slate-100"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button className="astra-btn" onClick={handleSubmit}>
          Finalizar
        </button>
      </AuthCard>
    </main>
  );
}