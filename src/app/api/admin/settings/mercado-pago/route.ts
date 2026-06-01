import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { getMercadoPagoToken, upsertMercadoPagoToken } from "@/lib/store-settings";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const accessToken = await getMercadoPagoToken();
  return NextResponse.json({ accessToken });
}

export async function PUT(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { accessToken } = await request.json();
    await upsertMercadoPagoToken(accessToken);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 400 });
  }
}
