"use client";
import Link from "next/link";
import React, { useState } from "react";

export interface Credito {
  nombreCliente: string;
  identificacion: string;
  valor: number;
  tasaInteres: number;
  plazoMeses: number;
  comercial: string;
  fecha_registro?: string;
}

interface Props {
  onSuccess?: () => void;
}

const CreditoForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<Credito>({
    nombreCliente: "", identificacion: "", valor: 0,
    tasaInteres: 0, plazoMeses: 0, comercial: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["valor", "tasaInteres", "plazoMeses"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

      if (!form.nombreCliente.trim()) {
        setError("El nombre del cliente es obligatorio");
        return;
      }

      if (!form.identificacion.trim()) {
        setError("La cédula o ID es obligatoria");
        return;
      }

      if (!/^\d+$/.test(form.identificacion)) {
        setError("La cédula o ID solo puede contener números");
        return;
      }

      if (!form.valor || Number(form.valor) <= 0) {
        setError("El valor del crédito debe ser mayor a 0");
        return;
      }

      if (!form.tasaInteres || Number(form.tasaInteres) < 0) {
        setError("La tasa de interés no puede ser negativa");
        return;
      }

      if (!form.plazoMeses || Number(form.plazoMeses) <= 0) {
        setError("El plazo en meses debe ser mayor a 0");
        return;
      }

      if (!form.comercial.trim()) {
        setError("Debes asignar un comercial");
        return;
      }
      
    try {
      const res = await fetch("http://localhost:4000/api/creditos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      onSuccess?.();
      alert("Crédito registrado correctamente");
      setForm({ nombreCliente: "", identificacion: "", valor: 0, tasaInteres: 0, plazoMeses: 0, comercial: "" });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-gray-400";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition mb-6">
        ← Volver a la lista de créditos
      </Link>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">Registrar Crédito</h2>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 overflow-hidden">

        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <p className={labelClass}>Datos del cliente</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nombreCliente" className={labelClass}>Nombre cliente</label>
            <input id="nombreCliente" type="text" name="nombreCliente" value={form.nombreCliente} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="identificacion" className={labelClass}>Cédula o ID</label>
            <input id="identificacion" type="text" name="identificacion" value={form.identificacion} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className="bg-gray-50 border-y border-gray-200 px-4 py-2">
          <p className={labelClass}>Condiciones del crédito</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 py-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="valor" className={labelClass}>Valor</label>
            <input id="valor" type="number" name="valor" value={form.valor} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tasaInteres" className={labelClass}>Tasa de interés (%)</label>
            <input id="tasaInteres" type="number" name="tasaInteres" value={form.tasaInteres} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="plazoMeses" className={labelClass}>Plazo en meses</label>
            <input id="plazoMeses" type="number" name="plazoMeses" value={form.plazoMeses} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className="bg-gray-50 border-y border-gray-200 px-4 py-2">
          <p className={labelClass}>Asignación</p>
        </div>
        <div className="px-4 py-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comercial" className={labelClass}>Comercial</label>
            <input id="comercial" type="text" name="comercial" value={form.comercial} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-gray-50">
          {error ? <p className="text-sm text-red-500">{error}</p> : <span />}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition cursor-pointer"
          >
            {loading ? "Registrando..." : "Registrar Crédito"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreditoForm;