import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Links</h1>
      <div className="space-y-4">
        <Link 
          href="/powerbi" 
          className="block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Power BI Dashboard
        </Link>
        <Link 
          href="/superset" 
          className="block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Superset
        </Link>
        <Link 
          href="/metabase" 
          className="block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Metabase Dashboard
        </Link>
      </div>
    </div>
  );
}