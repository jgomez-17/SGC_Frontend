"use client";

import { useState, useEffect } from "react";

interface Credito {
  id: number;
  nombre_cliente: string;
  identificacion: string;
  valor: number;
  tasa_interes: number;
  plazo_meses: number;
  comercial: string;
  fecha_registro: string;
}

type OrdenCampo = "fecha_registro" | "valor";
type OrdenTipo = "asc" | "desc";

export default function CreditList() {
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordenCampo, setOrdenCampo] = useState<OrdenCampo>("fecha_registro");
  const [ordenTipo, setOrdenTipo] = useState<OrdenTipo>("desc");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCreditos = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filtro) params.append("filtro", filtro);
      params.append("ordenCampo", ordenCampo);
      params.append("ordenTipo", ordenTipo);

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());

      const data: Credito[] = await res.json();
      setCreditos(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditos();
  }, [filtro, ordenCampo, ordenTipo]);

  const selectClass = "px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white text-gray-700";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Lista de Créditos</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Filtrar por nombre, ID o comercial"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
        />
        <select value={ordenCampo} onChange={(e) => setOrdenCampo(e.target.value as OrdenCampo)} className={selectClass}>
          <option value="fecha_registro">Fecha</option>
          <option value="valor">Valor</option>
        </select>
        <select value={ordenTipo} onChange={(e) => setOrdenTipo(e.target.value as OrdenTipo)} className={selectClass}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      {loading && <p className="text-sm text-gray-400 py-4 text-center">Cargando créditos...</p>}
      {error && <p className="text-sm text-red-500 py-2">{error}</p>}

      {!loading && !error && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-50 text-xs capitalize tracking-wide text-gray-400 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium">Cliente</th>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Valor</th>
                <th className="px-4 py-3 text-left font-medium">Tasa</th>
                <th className="px-4 py-3 text-left font-medium">Plazo</th>
                <th className="px-4 py-3 text-left font-medium">Comercial</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {creditos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                    No se encontraron créditos
                  </td>
                </tr>
              ) : (
                creditos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 capitalize transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.nombre_cliente}</td>
                    <td className="px-4 py-3 text-gray-500">{c.identificacion}</td>
                    <td className="px-4 py-3 font-medium text-gray-800"> {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(c.valor)}</td>
                    <td className="px-4 py-3">{c.tasa_interes}%</td>
                    <td className="px-4 py-3">{c.plazo_meses} m</td>
                    <td className="px-4 py-3">{c.comercial}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(c.fecha_registro).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}