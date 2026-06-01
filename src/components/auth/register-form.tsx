"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      phone: form.get("phone") as string,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const err = await res.json();
      setError(err.error || "Erro ao cadastrar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nome</label>
        <input
          name="name"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Telefone</label>
        <input
          name="phone"
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
      <p className="text-center text-sm text-stone-500">
        Já tem conta?{" "}
        <Link href="/login" className="text-amber-700 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
