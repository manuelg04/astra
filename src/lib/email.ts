export function normalizeEmail(raw: string) {
    return raw.trim().toLowerCase();
  }
  
  export function isEmail(email: string) {
    // Expresión simple y suficiente para validar formato \w@w.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }