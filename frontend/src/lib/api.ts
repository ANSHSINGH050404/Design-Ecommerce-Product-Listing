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

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function authRequest<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    } as HeadersInit,
  });
}

export const api = {
  register(name: string, email: string, password: string) {
    return request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  registerAdmin(
    name: string,
    email: string,
    password: string,
    adminSecret: string
  ) {
    return request<AuthResponse>("/register-admin", {
      method: "POST",
      body: JSON.stringify({ name, email, password, adminSecret }),
    });
  },

  login(email: string, password: string) {
    return request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return authRequest<{ user: User }>("/me");
  },

  getProducts() {
    return request<{ products: Product[] }>("/products");
  },

  getProduct(id: number) {
    return request<{ product: Product }>(`/products/${id}`);
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
