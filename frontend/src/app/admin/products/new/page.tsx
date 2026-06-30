"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createProduct(name, description, Number(price), token!);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
