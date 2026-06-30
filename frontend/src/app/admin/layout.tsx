"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div>
      <div className="flex gap-6 mb-6 border-b pb-3">
        <Link href="/admin" className="font-medium hover:text-blue-600">
          Dashboard
        </Link>
        <Link
          href="/admin/products/new"
          className="font-medium hover:text-blue-600"
        >
          Add Product
        </Link>
        <Link href="/products" className="font-medium hover:text-blue-600">
          View Store
        </Link>
      </div>
      {children}
    </div>
  );
}
