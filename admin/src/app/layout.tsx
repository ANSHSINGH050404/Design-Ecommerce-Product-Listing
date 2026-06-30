"use client";

import Link from "next/link";
import { useAuth, AuthProvider } from "@/lib/auth";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Admin Panel
        </Link>
        {user && (
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-blue-300">
              Dashboard
            </Link>
            <Link href="/products/new" className="hover:text-blue-300">
              Add Product
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </AuthProvider>
  );
}
