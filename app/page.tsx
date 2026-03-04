import CreditList from "./components/creditTable/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-800">Sistema de Gestión de Créditos</span>
          <Link href="components/creditForm">
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
              + Nuevo Crédito
            </button>
          </Link>
        </div>
      </nav>

      <CreditList />
    </div>
  );
}