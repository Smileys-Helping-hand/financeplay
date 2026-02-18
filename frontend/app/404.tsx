import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go Home</span>
      </Link>
    </div>
  );
}
