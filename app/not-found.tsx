import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <h2 className="text-4xl font-bold mb-4">404 - No Encontrado</h2>
      <p className="mb-6">No pudimos encontrar la página que buscas.</p>
      <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Volver al inicio
      </Link>
    </div>
  )
}
