"use client";

import { useState } from "react";

interface LoginProps {
  onLogin: (data: { email: string; password: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onLogin({ email, password });
      // puedes redirigir o actualizar estado en el padre
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 mb-4 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white text-gray-700";

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}