"use client";

import Link from "next/link";
import { useAuth, AuthProvider } from "@/lib/auth";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          ShopEase
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          {user ? (
            <>
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
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
