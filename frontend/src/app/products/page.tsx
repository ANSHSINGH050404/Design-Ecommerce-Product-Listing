"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Product } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then((res) => setProducts(res.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-gray-500">Loading products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {p.description}
              </p>
              <p className="text-blue-600 font-bold mt-3">${p.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
