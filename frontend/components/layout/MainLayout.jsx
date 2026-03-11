import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white font-semibold text-base mb-1">🏡 SmartVillage</p>
          <p>Connecting rural communities for a better tomorrow</p>
          <p className="mt-2 text-xs text-gray-600">© {new Date().getFullYear()} SmartVillage. Open source.</p>
        </div>
      </footer>
    </div>
  );
}
