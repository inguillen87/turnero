import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-md text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Turnero Pro</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Bienvenido al sistema de gestión de turnos.
        </p>
        <Link
          href="/t/demo/dashboard"
          className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
        >
          Ir a la Demo
        </Link>
      </div>
    </div>
  );
}
