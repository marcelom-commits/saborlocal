import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { getPixSettings, upsertPixSettings } from "@/lib/store-settings";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const settings = await getPixSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const data = await request.json();
    await upsertPixSettings(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 400 });
  }
}
