// Mock API responses with data
const API_BASE = "http://localhost:3001";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  cccd: string;
  address: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  pricePerDay: number;
  licensePlate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collateral {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Violation {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  cccd: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  userId: string;
  carId: string;
  collateralId: string;
  startDate: string;
  endDate: string;
  estimatedPrice: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  car?: Car;
  collateral?: Collateral;
}

// API functions
export const api = {
  cars: {
    getList: async (start?: string, end?: string) => {
      const url = new URL(`${API_BASE}/cars`);

      if (start) url.searchParams.append("start", start);
      if (end) url.searchParams.append("end", end);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Fail to get cars");

      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/cars/${id}`);
      if (!res.ok) throw new Error("Fail to get cars");
      return res.json();
    },
  },
  collaterals: {
    getList: async () => {
      const res = await fetch(`${API_BASE}/collaterals`);
      if (!res.ok) throw new Error("Fail to get assets");
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/collaterals/${id}`);
      return res.ok ? res.json() : null;
    },
  },
  violations: {
    getList: async (page = 1, limit = 10) => {
      const res = await fetch(
        `${API_BASE}/violations?page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch violations");
      return res.json(); // { data, total, page, limit }
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/violations/${id}`);
      if (!res.ok) throw new Error("Violation not found");
      return res.json();
    },
    create: async (data: Partial<Violation>) => {
      const res = await fetch(`${API_BASE}/violations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create violation failed");
      return res.json();
    },
    update: async (id: string, data: Partial<Violation>) => {
      const res = await fetch(`${API_BASE}/violations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update violation failed");
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/violations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete violation failed");
      return true;
    },
  },
  users: {
    getList: async (page = 1, limit = 10) => {
      const res = await fetch(`${API_BASE}/users?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },

    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },

    update: async (id: string, data: Partial<User>) => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },

    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      return true;
    },
  },
  contracts: {
    getList: async (userId: string, page = 1, limit = 10) => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        userId: userId,
      });

      const res = await fetch(`${API_BASE}/contracts?${query}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch contracts");
      return res.json();
    },

    create: async (data: Partial<Contract>) => {
      const res = await fetch(`${API_BASE}/contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create contract");
      return res.json();
    },
  },
};
