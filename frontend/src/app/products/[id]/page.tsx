"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Product } from "@/lib/api";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProduct(Number(id))
      .then((res) => setProduct(res.product))
      .catch(() => router.push("/products"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!product) return <p className="text-gray-500">Product not found.</p>;

  return (
    <div>
      <Link
        href="/products"
        className="text-blue-600 hover:underline text-sm"
      >
        &larr; Back to Products
      </Link>
      <div className="mt-4 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-3xl text-blue-600 font-bold mt-2">
          ${product.price}
        </p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-xs text-gray-400 mt-4">
          Created: {new Date(product.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
