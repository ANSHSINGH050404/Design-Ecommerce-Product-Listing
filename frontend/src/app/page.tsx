"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to ShopEase</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Browse our collection of products. Register an account to start shopping
        or log in to manage your listings.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Browse Products
        </Link>
        <Link
          href="/register"
          className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
