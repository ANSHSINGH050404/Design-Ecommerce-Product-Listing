export interface User {
  id: number;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? "Request failed");
  return body;
}

export const api = {
  login(email: string, password: string) {
    return request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe(token: string) {
    return request<{ user: User }>("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getProducts(token: string) {
    return request<{ products: Product[] }>("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getProduct(id: number, token: string) {
    return request<{ product: Product }>(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createProduct(
    name: string,
    description: string,
    price: number,
    token: string
  ) {
    return fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, price }),
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? "Request failed");
      return body as { message: string; product: Product };
    });
  },

  updateProduct(
    id: number,
    data: Partial<{ name: string; description: string; price: number }>,
    token: string
  ) {
    return fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? "Request failed");
      return body as { message: string; product: Product };
    });
  },

  deleteProduct(id: number, token: string) {
    return fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body.message ?? "Request failed");
      return body as { message: string };
    });
  },
};
