"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha inválidos");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
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
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="seu@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className="text-center text-sm text-stone-500">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-amber-700 hover:underline">
          Cadastre-se
        </Link>
      </p>
      <div className="text-xs text-stone-400 text-center space-y-1">
        <p>Demo: admin@saborlocal.com / admin123</p>
        <p>Demo: cliente@saborlocal.com / 123456</p>
      </div>
    </form>
  );
}
