import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r px-4 py-6">
      <h2 className="text-xl font-bold mb-6">PowerSync</h2>
      <nav className="space-y-4">
        <Link href="/" className="block text-gray-700 hover:text-black">
          Dashboard
        </Link>
        <Link href="/catalog" className="block text-gray-700 hover:text-black">
          Products
        </Link>
        <Link href="/products-sync" className="block text-gray-700 hover:text-black">
          Synced Products
        </Link>
        <Link href="/logs" className="block text-gray-700 hover:text-black">
          Sync Logs
        </Link>
        <Link href="/settings" className="block text-gray-700 hover:text-black">
          Settings
        </Link>
      </nav>
    </aside>
  );
}
