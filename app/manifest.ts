import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Turnero Pro',
    short_name: 'Turnero',
    description: 'Gestión de turnos inteligente para profesionales',
    start_url: '/', // Start at root to avoid 404 if slug is missing or auth is needed
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5', // indigo-600
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
