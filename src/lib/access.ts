import { auth } from "./auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return session.user;
}

export async function requireUserApi() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return session.user;
}

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  return session.user;
}
